
var escape = require('escape-html');

/**
 * Expose `Highlight`.
 */

module.exports = Highlight;

/**
 * Language class matcher.
 */

var matcher = /\blang(?:uage)?-(\w+)\b/i;

/**
 * Initialize a new `Highlight` instance.
 */

function Highlight(){
  if (!(this instanceof Highlight)) return new Highlight();
  this.languages = {};
}

/**
 * Use a `plugin` function.
 *
 * @param {Function} plugin
 * @return {Highlight}
 */

Highlight.prototype.use = function(plugin){
  plugin(this);
  return this;
};

/**
 * Define a new `language` with a `grammar`.
 *
 * @param {String} language
 * @param {Object} grammar
 * @return {Highlight}
 */

Highlight.prototype.language = function(language, grammar){
  this.languages[language] = grammar;
  return this;
};

/**
 * Highlight an HTML `string` of a given `language`.
 *
 * @param {String} string
 * @param {String} language
 * @return {String}
 */

Highlight.prototype.string = function(string, language){
  var ast = this.parse(string, language);
  var str = this.stringify(ast);
  return str;
};

/**
 * Highlight an `el`.
 *
 * @param {Element or String} el
 */

Highlight.prototype.element = function(el){
  if ('string' == typeof el) el = document.querySelector(el);
  var lang = language(el);
  var str = this.string(el.textContent, lang);
  el.innerHTML = str;
};

/**
 * Highlight an array of `els`.
 *
 * @param {Array or String} els
 */

Highlight.prototype.elements = function(els){
  if ('string' == typeof els) els = document.querySelectorAll(els);
  for (var i = 0, el; el = els[i]; i++) this.element(el);
};

/**
 * Parse a `string` with a given language's `grammar`, returning an AST.
 *
 * @param {String} string
 * @param {String or Object} grammar
 * @return {Array}
 */

Highlight.prototype.parse = function(string, grammar){
  if ('string' == typeof grammar) {
    var lang = grammar;
    grammar = this.languages[lang];
    if (!grammar) throw new Error('unknown language "' + lang + '"');
  }

  if (!grammar) throw new Error('must provide a grammar');
  if (!string) return [];
  string = escape(string);
  var ret = [string];

  for (var key in grammar) {
    var rule = grammar[key];
    var regexp = rule.pattern || rule;

    for (var i = 0; i < ret.length; i++) {
      var str = ret[i];
      if ('object' == typeof str) continue;
      var m = regexp.exec(str);
      if (!m) continue;

      var contents = m[0];
      var before = str.slice(0, m.index);
      var after = str.slice(m.index + contents.length);
      var args = [i, 1];
      var token = {
        type: key,
        value: rule.children ? this.parse(contents, rule.children) : contents
      };

      if (before) args.push(before);
      args.push(token);
      if (after) args.push(after);
      ret.splice.apply(ret, args);
    }
  }

  return ret;
}

/**
 * Stringify a given `ast`.
 *
 * @param {Array} ast
 * @return {String}
 */

Highlight.prototype.stringify = function(ast){
  var self = this;
  return ast.map(function(t){
    if ('string' == typeof t) return t;
    if ('object' == typeof t.value) t.value = self.stringify(t.value);
    return '<span class="' + t.type + '">' + t.value + '</span>';
  }).join('');
};

/**
 * Get the code language for a given `el`. First look for a `data-language`
 * attribute, then a `language-*` class, then search up the DOM tree for them.
 *
 * @param {Element} el
 * @return {String}
 */

function language(el){
  if (!el) return;
  var m;
  if (el.hasAttribute('data-language')) return el.getAttribute('data-language');
  if (m = matcher.exec(el.className)) return m[1];
  return language(el.parentNode);
}