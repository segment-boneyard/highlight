
var assert = require('assert');
var domify = require('domify');
var Highlight = require('highlight');

describe('highlight', function(){
  it('should expose a constructor', function(){
    assert.equal('function', typeof Highlight);
  });

  it('should not require the new keyword', function(){
    var h = Highlight();
    assert(h instanceof Highlight);
  });

  it('should create a languages dictionary', function(){
    var h = Highlight();
    assert.deepEqual(h.languages, {});
  });

  describe('#use', function(){
    it('should use a plugin function', function(done){
      var h = Highlight();
      h.use(plugin);

      function plugin(instance){
        assert.equal(h, instance);
        done();
      }
    });
  });

  describe('#prefix', function(){
    it('should set a class name prefix', function(){
      var h = Highlight();
      h.prefix('prefix');
      assert.equal(h._prefix, 'prefix');
    });
  });

  describe('#language', function(){
    it('should define a new language with a grammar', function(){
      var h = Highlight();
      var grammar = {};
      assert.equal(h, h.language('css', grammar));
      assert.equal(h.languages.css, grammar);
    });
  });

  describe('#parse', function(){
    it('should parse a basic grammar', function(){
      var lang = 'handlebars';
      var grammar = { interpolation: /(\{\{\s*\w+\s*\}\})/ };
      var h = Highlight().language(lang, grammar);
      var str = 'an {{ interpolation }} in a {{ size }} string';
      var ast = h.parse(str, lang);
      assert.deepEqual(ast, [
        'an ',
        {
          type: 'interpolation',
          value: '{{ interpolation }}'
        },
        ' in a ',
        {
          type: 'interpolation',
          value: '{{ size }}'
        },
        ' string'
      ]);
    });

    it('should parse a nested grammar', function(){
      var lang = 'handlebars';
      var grammar = {
        block: {
          pattern: /(\{\{#\s*\w+\s*\}\}.*?\{\{\/\s*\w+\s*\}\})/,
          children: {
            open: /(\{\{#\s*\w+\s*\}\})/,
            close: /(\{\{\/\s*\w+\s*\}\})/
          }
        }
      };
      var h = Highlight().language(lang, grammar);
      var str = 'a {{#block}} in a {{/block}} string';
      var ast = h.parse(str, lang);
      assert.deepEqual(ast, [
        'a ',
        {
          type: 'block',
          value: [{
            type: 'open',
            value: '{{#block}}',
          },
          ' in a ',
          {
            type: 'close',
            value: '{{/block}}'
          }]
        },
        ' string'
      ]);
    });
  });

  describe('#stringify', function(){
    it('should stringify an ast', function(){
      var h = Highlight().use(fixture);
      var code = h.stringify([
        'an ',
        {
          type: 'interpolation',
          value: '{{interpolation}}'
        },
        ' and a ',
        {
          type: 'block',
          value: [{
            type: 'open',
            value: '{{#block}}',
          },
          ' in a ',
          {
            type: 'close',
            value: '{{/block}}'
          }]
        },
        ' string'
      ]);

      assert.equal(code, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{interpolation}}</span>'
        + ' and a '
        + '<span class="Highlight-block">'
        + '<span class="Highlight-open">{{#block}}</span>'
        + ' in a '
        + '<span class="Highlight-close">{{/block}}</span>'
        + '</span>'
        + ' string');
    });

    it('should escape the output', function(){
      var h = Highlight();
      var code = h.stringify([
        '<',
        {
          type: 'tag',
          value: 'script'
        },
        '>'
      ]);
      assert.equal(code, '&lt;<span class="Highlight-tag">script</span>&gt;');
    });
  });

  describe('#string', function(){
    it('should highlight a string of a given language', function(){
      var h = Highlight().use(fixture);
      var code = h.string('an {{ interpolated }} string', 'fixture');
      assert.equal(code, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string');
    });
  });

  describe('#element', function(){
    it('should highlight the text content of an element', function(){
      var h = Highlight().use(fixture);
      var el = domify('<div data-language="fixture">an {{ interpolated }} string</div>');
      h.element(el);
      assert.equal(el.innerHTML, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string');
    });

    it('should guess the language from a class', function(){
      var h = Highlight().use(fixture);
      var el = domify('<div class="language-fixture">an {{ interpolated }} string</div>');
      h.element(el);
      assert.equal(el.innerHTML, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string');
    });

    it('should support language names with non alphabetic characters', function(){
      var h = Highlight().use(fixture);
      var el = domify('<div class="lang-objective-c">an {{ interpolated }} string</div>');
      h.element(el);
      assert.equal(el.innerHTML, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string');
    });

    it('should support language names with non alphabetic characters', function(){
      var h = Highlight().use(fixture);
      var el = domify('<div class="lang-.net">an {{ interpolated }} string</div>');
      h.element(el);
      assert.equal(el.innerHTML, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string');
    });

    it('should use a passed in languge', function(){
      var h = Highlight().use(fixture);
      var el = domify('<div>an {{ interpolated }} string</div>');
      h.element(el, 'fixture');
      assert.equal(el.innerHTML, ''
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string');
    });
  });

  describe('#elements', function(){
    it('should highlight the text content of multiple elements', function(){
      var h = Highlight().use(fixture);
      var el = domify('<div>'
        + '<code data-language="fixture">a {{#block}} in a {{/block}} string</code>'
        + '<code class="language-fixture">an {{ interpolated }} string</code>'
        + '</div>');

      h.elements(el.querySelectorAll('code'));
      assert.equal(el.innerHTML, ''
        + '<code data-language="fixture">'
        + 'a '
        + '<span class="Highlight-block">'
        + '<span class="Highlight-open">{{#block}}</span>'
        + ' in a '
        + '<span class="Highlight-close">{{/block}}</span>'
        + '</span>'
        + ' string'
        + '</code>'
        + '<code class="language-fixture">'
        + 'an '
        + '<span class="Highlight-interpolation">{{ interpolated }}</span>'
        + ' string'
        + '</code>');
    });
  });
});

/**
 * Plugin fixture.
 *
 * @param {Highlight} highlight
 */

function fixture(highlight){
  var obj = {};
  highlight.language('objective-c', obj);
  highlight.language('fixture', obj);
  highlight.language('.net', obj);
  obj.interpolation = /(\{\{\s*\w+\s*\}\})/;
  obj.block = {
    pattern: /(\{\{#\s*\w+\s*\}\}.*?\{\{\/\s*\w+\s*\}\})/,
    children: {
      open: /(\{\{#\s*\w+\s*\}\})/,
      close: /(\{\{\/\s*\w+\s*\}\})/
    }
  };
}