'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    fs = require('fs'),
    handlebars = require('handlebars'),
    is = require('annois'),
    path = require('path');

var UMD = function UMD(code, options) {
    if(!code) {
        throw new Error('Missing code to convert!');
    }

    EventEmitter.call(this);
    this.code = code;
    this.options = options || {};

    this.template = this.loadTemplate(this.options.template);
};

inherits(UMD, EventEmitter);

UMD.prototype._getDependencyDefaults = function _getDependencyDefaults() {
    var globalAlias = this.options.globalAlias;

    return {
        amd: {
            items: [],
            prefix: '\"',
            separator: ',\n',
            suffix: '\"'
        },
        cjs: {
            items: [],
            prefix: 'require(\"',
            separator: ',\n',
            suffix: '\")'
        },
        global: {
            items: [],
            prefix: globalAlias ? globalAlias + '.' : '',
            separator: ',\n',
            suffix: ''
        }
    };
};

UMD.prototype.loadTemplate = function loadTemplate(filepath) {
    var tplPath,
        exists = fs.existsSync;

    if (filepath) {
        if (exists(filepath)) {
            tplPath = filepath;
        }
        else {
            tplPath = path.join(__dirname, 'templates', filepath + '.hbs');

            if (!exists(tplPath)) {
                tplPath = path.join(__dirname, 'templates', filepath);

                if (!exists(tplPath)) {
                    this.emit('error', 'Cannot find template file "' + filepath + '".');
                    return;
                }
            }
        }
    }
    else {
        tplPath = path.join(__dirname, 'templates', 'umd.hbs');
    }

    try {
        return handlebars.compile(fs.readFileSync(tplPath, 'utf-8'));
    }
    catch (e) {
        this.emit('error', e.message);
    }
};

UMD.prototype.generate = function generate() {
    var options = this.options,
        code = this.code,
        extend = UMD.extend,
        ctx = extend({}, options);

    var depsOptions = extend(this._getDependencyDefaults(options) || {}, options.deps);

    var defaultDeps = depsOptions['default'],
        deps = defaultDeps ? defaultDeps || defaultDeps.items || [] : [],
        dependency,
        dependencyType,
        items,
        prefix,
        separator,
        suffix;

    for (dependencyType in depsOptions) {
        dependency = depsOptions[dependencyType];
        items = is.array(dependency) ? dependency : dependency.items || deps;
        prefix = dependency.prefix || '';
        separator = dependency.separator || ', ';
        suffix = dependency.suffix || '';
        ctx[dependencyType + 'Dependencies'] = items.map(UMD.wrap(prefix, suffix)).join(separator);
    }

    ctx.dependencies = (depsOptions.args || deps).join(', ');

    ctx.code = code;

    return this.template(ctx);
};

UMD.wrap = function wrap(pre, post) {
    pre = pre || '';
    post = post || '';

    return function (v) {
        return pre + v + post;
    };
};

UMD.extend = function extend(target, source) {
    var prop;

    for (prop in source) {
        if (prop in target && typeof target[prop] === 'object') {
            extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }

    return target;
};

module.exports = function(code, options) {
    var u = new UMD(code, options);

    return u.generate();
};
