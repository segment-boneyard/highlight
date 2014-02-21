
# highlight

  A simple API for code highlighting.

  Because all of the existing Javascript highlighting APIs are way too convoluted.

## Installation

    $ component install segmentio/highlight

## Example

```js
var Highlight = require('highlight')
var html = require('highlight-javascript');
var js = require('highlight-javascript');

var highlight = new Highlight()
  .use(html)
  .use(js);

var el = document.querySelector('.code-sample');
highlight.element(el);
```

  ...or if you're lazy, you can just pass a selector string:

```js
highlight.element('.code-sample');
```

  ...or if you're _incredibly_ lazy, you can just highlight everything:

```js
highlight.all();
```

## Languages

- [CSS](https://github.com/segmentio/highlight-css)
- [HTML](https://github.com/segmentio/highlight-html)
- [Javascript](https://github.com/segmentio/highlight-javascript)

## API

#### new Highlight()

  Create a new `Highlight` instance.

#### #use(plugin)

  Apply a `plugin` function, for example language syntaxes.

#### #string(string, language)

  Highlight a `string` of code of a given `language`.

#### #element(el)

  Highlight an `el`. It will use the `data-language` attribute:

    <pre data-language="css"><code></code></pre>

#### #elements(els)

  Highlight a series of `els`.

#### #all()

  Highlight all of the elements in the DOM that have a `data-language` attribute.

#### #language(name, grammar)

  Define a new language by `name` with a `grammar`.

#### #prefix(string)

  Set the CSS class name prefix `string`.

## License

  MIT