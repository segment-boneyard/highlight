
# highlight

  A simple API for code highlighting.

  Because all of the existing Javascript highlighting APIs are way too convoluted. For now this uses [Prism.js](http://prismjs.com/) under the covers, but it might not later.

## Installation

    $ component install ianstormtaylor/highlight

## API

#### highlight(element)

  Highlight an `element`. It will use the `data-language` attribute:

    <pre data-language="css"><code></code></pre>

#### highlight(string)

  Highlight a `string` of html.

## License

  MIT