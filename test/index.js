
var assert = require('assert');
var Highlight = require('highlight');

/**
 * Grammar fixture.
 */

var handlebars = {
  'interpolation': /(\{\{\s*\w+\s*\}\})/
}

/**
 * Plugin fixture.
 *
 * @param {Highlight} highlight
 */

function fixture(highlight){
  highlight.language('handlebars', handlebars);
}

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
          pattern: /\{\{#\s*\w+\s*\}\}.*?\{\{\/\s*\w+\s*\}\}/,
          children: {
            open: /\{\{#\s*\w+\s*\}\}/,
            close: /\{\{\/\s*\w+\s*\}\}/
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
      var ast = h.parse('an {{ interpolation }} in a {{ size }} string', 'handlebars');
      var code = h.stringify(ast);
      assert.equal(code, 'an <span class="interpolation">{{ interpolation }}</span> in a <span class="interpolation">{{ size }}</span> string');
    });
  });

});