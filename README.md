[![build status](https://secure.travis-ci.org/bebraw/libumd.png)](http://travis-ci.org/bebraw/libumd)
# libumd - Wraps given JavaScript code with UMD

## Usage

```js
var umdify = require('libumd');

...

var result = umdify(js, options);
```

options (all are optional by default):

```js
{
    indent: '    ', // defaults to '  '
    template: 'path to template', // defaults to 'umd'
    globalAlias: 'alias', // name of the global variable
    deps: { // dependencies
        'default': ['foo', 'bar'],
        amd: ['foobar', 'barbar'],
        cjs: ['foo', 'barbar'],
        global: ['foobar', 'bar']
    }
}
```

## License

`libumd` is available under MIT. See LICENSE for more details.

