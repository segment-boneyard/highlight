
# highlight

  A simple, pluggable API for syntax highlighting.

  All the existing syntax highlighting libraries have pretty convoluted APIs. And lots bundle the languages directly into the core library, which makes it much harder to make reason about them individually, or to have the smallest possible filesize if you don't need the esoteric ones.

  So... that's why this was created. The language definitions are all separate plugins, so you can get the smallest possible file size, and so that they're simpler for everyone to contribute to (because regexes are already hard enough to read as it is).

  And it doesn't highlight every element on the page by default when loaded.

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

#### #prefix(string)

  Set the CSS class name prefix `string`.

#### #language(name, grammar)

  Define a new language by `name` with a `grammar`.

#### #parse(string, language)
 
  Return an AST for a given `string` and `language`.

#### #stringify(ast)

  Convert an `AST` into a string of HTML.

## License

  MIT