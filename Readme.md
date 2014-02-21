
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
var html = require('highlight-html');
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

```html
<pre data-language="css"><code>YOUR CODE HERE</code></pre>
```

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

  The MIT License

  Copyright &copy; 2014 Segment.io

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.