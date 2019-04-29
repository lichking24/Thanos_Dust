'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseContent = exports.resolvePseudoContent = exports.popCounters = exports.parseCounterReset = exports.TOKEN_TYPE = exports.PSEUDO_CONTENT_ITEM_TYPE = void 0;

var _ListItem = require("./ListItem");

var _listStyle = require("./parsing/listStyle");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var PSEUDO_CONTENT_ITEM_TYPE = {
  TEXT: 0,
  IMAGE: 1
};
exports.PSEUDO_CONTENT_ITEM_TYPE = PSEUDO_CONTENT_ITEM_TYPE;
var TOKEN_TYPE = {
  STRING: 0,
  ATTRIBUTE: 1,
  URL: 2,
  COUNTER: 3,
  COUNTERS: 4,
  OPENQUOTE: 5,
  CLOSEQUOTE: 6
};
exports.TOKEN_TYPE = TOKEN_TYPE;

var parseCounterReset = function parseCounterReset(style, data) {
  if (!style || !style.counterReset || style.counterReset === 'none') {
    return [];
  }

  var counterNames = [];
  var counterResets = style.counterReset.split(/\s*,\s*/);
  var lenCounterResets = counterResets.length;

  for (var i = 0; i < lenCounterResets; i++) {
    var _counterResets$i$spli = counterResets[i].split(/\s+/),
        _counterResets$i$spli2 = _slicedToArray(_counterResets$i$spli, 2),
        counterName = _counterResets$i$spli2[0],
        initialValue = _counterResets$i$spli2[1];

    counterNames.push(counterName);
    var counter = data.counters[counterName];

    if (!counter) {
      counter = data.counters[counterName] = [];
    }

    counter.push(parseInt(initialValue || 0, 10));
  }

  return counterNames;
};

exports.parseCounterReset = parseCounterReset;

var popCounters = function popCounters(counterNames, data) {
  var lenCounters = counterNames.length;

  for (var i = 0; i < lenCounters; i++) {
    data.counters[counterNames[i]].pop();
  }
};

exports.popCounters = popCounters;

var resolvePseudoContent = function resolvePseudoContent(node, style, data) {
  if (!style || !style.content || style.content === 'none' || style.content === '-moz-alt-content' || style.display === 'none') {
    return null;
  }

  var tokens = parseContent(style.content);
  var len = tokens.length;
  var contentItems = [];
  var s = ''; // increment the counter (if there is a "counter-increment" declaration)

  var counterIncrement = style.counterIncrement;

  if (counterIncrement && counterIncrement !== 'none') {
    var _counterIncrement$spl = counterIncrement.split(/\s+/),
        _counterIncrement$spl2 = _slicedToArray(_counterIncrement$spl, 2),
        counterName = _counterIncrement$spl2[0],
        incrementValue = _counterIncrement$spl2[1];

    var counter = data.counters[counterName];

    if (counter) {
      counter[counter.length - 1] += incrementValue === undefined ? 1 : parseInt(incrementValue, 10);
    }
  } // build the content string


  for (var i = 0; i < len; i++) {
    var token = tokens[i];

    switch (token.type) {
      case TOKEN_TYPE.STRING:
        s += token.value || '';
        break;

      case TOKEN_TYPE.ATTRIBUTE:
        if (node instanceof HTMLElement && token.value) {
          s += node.getAttribute(token.value) || '';
        }

        break;

      case TOKEN_TYPE.COUNTER:
        var _counter = data.counters[token.name || ''];

        if (_counter) {
          s += formatCounterValue([_counter[_counter.length - 1]], '', token.format);
        }

        break;

      case TOKEN_TYPE.COUNTERS:
        var counters = data.counters[token.name || ''];

        if (counters) {
          s += formatCounterValue(counters, token.glue, token.format);
        }

        break;

      case TOKEN_TYPE.OPENQUOTE:
        s += getQuote(style, true, data.quoteDepth);
        data.quoteDepth++;
        break;

      case TOKEN_TYPE.CLOSEQUOTE:
        data.quoteDepth--;
        s += getQuote(style, false, data.quoteDepth);
        break;

      case TOKEN_TYPE.URL:
        if (s) {
          contentItems.push({
            type: PSEUDO_CONTENT_ITEM_TYPE.TEXT,
            value: s
          });
          s = '';
        }

        contentItems.push({
          type: PSEUDO_CONTENT_ITEM_TYPE.IMAGE,
          value: token.value || ''
        });
        break;
    }
  }

  if (s) {
    contentItems.push({
      type: PSEUDO_CONTENT_ITEM_TYPE.TEXT,
      value: s
    });
  }

  return contentItems;
};

exports.resolvePseudoContent = resolvePseudoContent;

var parseContent = function parseContent(content, cache) {
  if (cache && cache[content]) {
    return cache[content];
  }

  var tokens = [];
  var len = content.length;
  var isString = false;
  var isEscaped = false;
  var isFunction = false;
  var str = '';
  var functionName = '';
  var args = [];

  for (var i = 0; i < len; i++) {
    var c = content.charAt(i);

    switch (c) {
      case "'":
      case '"':
        if (isEscaped) {
          str += c;
        } else {
          isString = !isString;

          if (!isFunction && !isString) {
            tokens.push({
              type: TOKEN_TYPE.STRING,
              value: str
            });
            str = '';
          }
        }

        break;

      case '\\':
        if (isEscaped) {
          str += c;
          isEscaped = false;
        } else {
          isEscaped = true;
        }

        break;

      case '(':
        if (isString) {
          str += c;
        } else {
          isFunction = true;
          functionName = str;
          str = '';
          args = [];
        }

        break;

      case ')':
        if (isString) {
          str += c;
        } else if (isFunction) {
          if (str) {
            args.push(str);
          }

          switch (functionName) {
            case 'attr':
              if (args.length > 0) {
                tokens.push({
                  type: TOKEN_TYPE.ATTRIBUTE,
                  value: args[0]
                });
              }

              break;

            case 'counter':
              if (args.length > 0) {
                var counter = {
                  type: TOKEN_TYPE.COUNTER,
                  name: args[0]
                };

                if (args.length > 1) {
                  counter.format = args[1];
                }

                tokens.push(counter);
              }

              break;

            case 'counters':
              if (args.length > 0) {
                var counters = {
                  type: TOKEN_TYPE.COUNTERS,
                  name: args[0]
                };

                if (args.length > 1) {
                  counters.glue = args[1];
                }

                if (args.length > 2) {
                  counters.format = args[2];
                }

                tokens.push(counters);
              }

              break;

            case 'url':
              if (args.length > 0) {
                tokens.push({
                  type: TOKEN_TYPE.URL,
                  value: args[0]
                });
              }

              break;
          }

          isFunction = false;
          str = '';
        }

        break;

      case ',':
        if (isString) {
          str += c;
        } else if (isFunction) {
          args.push(str);
          str = '';
        }

        break;

      case ' ':
      case '\t':
        if (isString) {
          str += c;
        } else if (str) {
          addOtherToken(tokens, str);
          str = '';
        }

        break;

      default:
        str += c;
    }

    if (c !== '\\') {
      isEscaped = false;
    }
  }

  if (str) {
    addOtherToken(tokens, str);
  }

  if (cache) {
    cache[content] = tokens;
  }

  return tokens;
};

exports.parseContent = parseContent;

var addOtherToken = function addOtherToken(tokens, identifier) {
  switch (identifier) {
    case 'open-quote':
      tokens.push({
        type: TOKEN_TYPE.OPENQUOTE
      });
      break;

    case 'close-quote':
      tokens.push({
        type: TOKEN_TYPE.CLOSEQUOTE
      });
      break;
  }
};

var getQuote = function getQuote(style, isOpening, quoteDepth) {
  var quotes = style.quotes ? style.quotes.split(/\s+/) : ["'\"'", "'\"'"];
  var idx = quoteDepth * 2;

  if (idx >= quotes.length) {
    idx = quotes.length - 2;
  }

  if (!isOpening) {
    ++idx;
  }

  return quotes[idx].replace(/^["']|["']$/g, '');
};

var formatCounterValue = function formatCounterValue(counter, glue, format) {
  var len = counter.length;
  var result = '';

  for (var i = 0; i < len; i++) {
    if (i > 0) {
      result += glue || '';
    }

    result += (0, _ListItem.createCounterText)(counter[i], (0, _listStyle.parseListStyleType)(format || 'decimal'), false);
  }

  return result;
};