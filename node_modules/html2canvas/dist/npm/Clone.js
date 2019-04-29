'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneWindow = exports.DocumentCloner = void 0;

var _Bounds = require("./Bounds");

var _Proxy = require("./Proxy");

var _ResourceLoader = _interopRequireDefault(require("./ResourceLoader"));

var _Util = require("./Util");

var _background = require("./parsing/background");

var _CanvasRenderer = _interopRequireDefault(require("./renderer/CanvasRenderer"));

var _PseudoNodeContent = require("./PseudoNodeContent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';

var DocumentCloner =
/*#__PURE__*/
function () {
  function DocumentCloner(element, options, logger, copyInline, renderer) {
    _classCallCheck(this, DocumentCloner);

    this.referenceElement = element;
    this.scrolledElements = [];
    this.copyStyles = copyInline;
    this.inlineImages = copyInline;
    this.logger = logger;
    this.options = options;
    this.renderer = renderer;
    this.resourceLoader = new _ResourceLoader.default(options, logger, window);
    this.pseudoContentData = {
      counters: {},
      quoteDepth: 0
    }; // $FlowFixMe

    this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
  }

  _createClass(DocumentCloner, [{
    key: "inlineAllImages",
    value: function inlineAllImages(node) {
      var _this = this;

      if (this.inlineImages && node) {
        var style = node.style;
        Promise.all((0, _background.parseBackgroundImage)(style.backgroundImage).map(function (backgroundImage) {
          if (backgroundImage.method === 'url') {
            return _this.resourceLoader.inlineImage(backgroundImage.args[0]).then(function (img) {
              return img && typeof img.src === 'string' ? "url(\"".concat(img.src, "\")") : 'none';
            }).catch(function (e) {
              if (process.env.NODE_ENV !== "production") {
                _this.logger.log("Unable to load image", e);
              }
            });
          }

          return Promise.resolve("".concat(backgroundImage.prefix).concat(backgroundImage.method, "(").concat(backgroundImage.args.join(','), ")"));
        })).then(function (backgroundImages) {
          if (backgroundImages.length > 1) {
            // TODO Multiple backgrounds somehow broken in Chrome
            style.backgroundColor = '';
          }

          style.backgroundImage = backgroundImages.join(',');
        });

        if (node instanceof HTMLImageElement) {
          this.resourceLoader.inlineImage(node.src).then(function (img) {
            if (img && node instanceof HTMLImageElement && node.parentNode) {
              var parentNode = node.parentNode;
              var clonedChild = (0, _Util.copyCSSStyles)(node.style, img.cloneNode(false));
              parentNode.replaceChild(clonedChild, node);
            }
          }).catch(function (e) {
            if (process.env.NODE_ENV !== "production") {
              _this.logger.log("Unable to load image", e);
            }
          });
        }
      }
    }
  }, {
    key: "inlineFonts",
    value: function inlineFonts(document) {
      var _this2 = this;

      return Promise.all(Array.from(document.styleSheets).map(function (sheet) {
        if (sheet.href) {
          return fetch(sheet.href).then(function (res) {
            return res.text();
          }).then(function (text) {
            return createStyleSheetFontsFromText(text, sheet.href);
          }).catch(function (e) {
            if (process.env.NODE_ENV !== "production") {
              _this2.logger.log("Unable to load stylesheet", e);
            }

            return [];
          });
        }

        return getSheetFonts(sheet, document);
      })).then(function (fonts) {
        return fonts.reduce(function (acc, font) {
          return acc.concat(font);
        }, []);
      }).then(function (fonts) {
        return Promise.all(fonts.map(function (font) {
          return fetch(font.formats[0].src).then(function (response) {
            return response.blob();
          }).then(function (blob) {
            return new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;

              reader.onload = function () {
                // $FlowFixMe
                var result = reader.result;
                resolve(result);
              };

              reader.readAsDataURL(blob);
            });
          }).then(function (dataUri) {
            font.fontFace.setProperty('src', "url(\"".concat(dataUri, "\")"));
            return "@font-face {".concat(font.fontFace.cssText, " ");
          });
        }));
      }).then(function (fontCss) {
        var style = document.createElement('style');
        style.textContent = fontCss.join('\n');

        _this2.documentElement.appendChild(style);
      });
    }
  }, {
    key: "createElementClone",
    value: function createElementClone(node) {
      var _this3 = this;

      if (this.copyStyles && node instanceof HTMLCanvasElement) {
        var img = node.ownerDocument.createElement('img');

        try {
          img.src = node.toDataURL();
          return img;
        } catch (e) {
          if (process.env.NODE_ENV !== "production") {
            this.logger.log("Unable to clone canvas contents, canvas is tainted");
          }
        }
      }

      if (node instanceof HTMLIFrameElement) {
        var tempIframe = node.cloneNode(false);
        var iframeKey = generateIframeKey();
        tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

        var _parseBounds = (0, _Bounds.parseBounds)(node, 0, 0),
            width = _parseBounds.width,
            height = _parseBounds.height;

        this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(node, this.options).then(function (documentElement) {
          return _this3.renderer(documentElement, {
            allowTaint: _this3.options.allowTaint,
            backgroundColor: '#ffffff',
            canvas: null,
            imageTimeout: _this3.options.imageTimeout,
            logging: _this3.options.logging,
            proxy: _this3.options.proxy,
            removeContainer: _this3.options.removeContainer,
            scale: _this3.options.scale,
            foreignObjectRendering: _this3.options.foreignObjectRendering,
            useCORS: _this3.options.useCORS,
            target: new _CanvasRenderer.default(),
            width: width,
            height: height,
            x: 0,
            y: 0,
            windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
            windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
            scrollX: documentElement.ownerDocument.defaultView.pageXOffset,
            scrollY: documentElement.ownerDocument.defaultView.pageYOffset
          }, _this3.logger.child(iframeKey));
        }).then(function (canvas) {
          return new Promise(function (resolve, reject) {
            var iframeCanvas = document.createElement('img');

            iframeCanvas.onload = function () {
              return resolve(canvas);
            };

            iframeCanvas.onerror = function (event) {
              // Empty iframes may result in empty "data:," URLs, which are invalid from the <img>'s point of view
              // and instead of `onload` cause `onerror` and unhandled rejection warnings
              // https://github.com/niklasvh/html2canvas/issues/1502
              iframeCanvas.src == 'data:,' ? resolve(canvas) : reject(event);
            };

            iframeCanvas.src = canvas.toDataURL();

            if (tempIframe.parentNode) {
              tempIframe.parentNode.replaceChild((0, _Util.copyCSSStyles)(node.ownerDocument.defaultView.getComputedStyle(node), iframeCanvas), tempIframe);
            }
          });
        });
        return tempIframe;
      }

      try {
        if (node instanceof HTMLStyleElement && node.sheet && node.sheet.cssRules) {
          var css = [].slice.call(node.sheet.cssRules, 0).reduce(function (css, rule) {
            if (rule && rule.cssText) {
              return css + rule.cssText;
            }

            return css;
          }, '');
          var style = node.cloneNode(false);
          style.textContent = css;
          return style;
        }
      } catch (e) {
        // accessing node.sheet.cssRules throws a DOMException
        this.logger.log('Unable to access cssRules property');

        if (e.name !== 'SecurityError') {
          this.logger.log(e);
          throw e;
        }
      }

      return node.cloneNode(false);
    }
  }, {
    key: "cloneNode",
    value: function cloneNode(node) {
      var clone = node.nodeType === Node.TEXT_NODE ? document.createTextNode(node.nodeValue) : this.createElementClone(node);
      var window = node.ownerDocument.defaultView;
      var style = node instanceof window.HTMLElement ? window.getComputedStyle(node) : null;
      var styleBefore = node instanceof window.HTMLElement ? window.getComputedStyle(node, ':before') : null;
      var styleAfter = node instanceof window.HTMLElement ? window.getComputedStyle(node, ':after') : null;

      if (this.referenceElement === node && clone instanceof window.HTMLElement) {
        this.clonedReferenceElement = clone;
      }

      if (clone instanceof window.HTMLBodyElement) {
        createPseudoHideStyles(clone);
      }

      var counters = (0, _PseudoNodeContent.parseCounterReset)(style, this.pseudoContentData);
      var contentBefore = (0, _PseudoNodeContent.resolvePseudoContent)(node, styleBefore, this.pseudoContentData);

      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType !== Node.ELEMENT_NODE || child.nodeName !== 'SCRIPT' && // $FlowFixMe
        !child.hasAttribute(IGNORE_ATTRIBUTE) && (typeof this.options.ignoreElements !== 'function' || // $FlowFixMe
        !this.options.ignoreElements(child))) {
          if (!this.copyStyles || child.nodeName !== 'STYLE') {
            clone.appendChild(this.cloneNode(child));
          }
        }
      }

      var contentAfter = (0, _PseudoNodeContent.resolvePseudoContent)(node, styleAfter, this.pseudoContentData);
      (0, _PseudoNodeContent.popCounters)(counters, this.pseudoContentData);

      if (node instanceof window.HTMLElement && clone instanceof window.HTMLElement) {
        if (styleBefore) {
          this.inlineAllImages(inlinePseudoElement(node, clone, styleBefore, contentBefore, PSEUDO_BEFORE));
        }

        if (styleAfter) {
          this.inlineAllImages(inlinePseudoElement(node, clone, styleAfter, contentAfter, PSEUDO_AFTER));
        }

        if (style && this.copyStyles && !(node instanceof HTMLIFrameElement)) {
          (0, _Util.copyCSSStyles)(style, clone);
        }

        this.inlineAllImages(clone);

        if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
          this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
        }

        switch (node.nodeName) {
          case 'CANVAS':
            if (!this.copyStyles) {
              cloneCanvasContents(node, clone);
            }

            break;

          case 'TEXTAREA':
          case 'SELECT':
            clone.value = node.value;
            break;
        }
      }

      return clone;
    }
  }]);

  return DocumentCloner;
}();

exports.DocumentCloner = DocumentCloner;

var getSheetFonts = function getSheetFonts(sheet, document) {
  // $FlowFixMe
  return (sheet.cssRules ? Array.from(sheet.cssRules) : []).filter(function (rule) {
    return rule.type === CSSRule.FONT_FACE_RULE;
  }).map(function (rule) {
    var src = (0, _background.parseBackgroundImage)(rule.style.getPropertyValue('src'));
    var formats = [];

    for (var i = 0; i < src.length; i++) {
      if (src[i].method === 'url' && src[i + 1] && src[i + 1].method === 'format') {
        var a = document.createElement('a');
        a.href = src[i].args[0];

        if (document.body) {
          document.body.appendChild(a);
        }

        var font = {
          src: a.href,
          format: src[i + 1].args[0]
        };
        formats.push(font);
      }
    }

    return {
      // TODO select correct format for browser),
      formats: formats.filter(function (font) {
        return /^woff/i.test(font.format);
      }),
      fontFace: rule.style
    };
  }).filter(function (font) {
    return font.formats.length;
  });
};

var createStyleSheetFontsFromText = function createStyleSheetFontsFromText(text, baseHref) {
  var doc = document.implementation.createHTMLDocument('');
  var base = document.createElement('base'); // $FlowFixMe

  base.href = baseHref;
  var style = document.createElement('style');
  style.textContent = text;

  if (doc.head) {
    doc.head.appendChild(base);
  }

  if (doc.body) {
    doc.body.appendChild(style);
  }

  return style.sheet ? getSheetFonts(style.sheet, doc) : [];
};

var restoreOwnerScroll = function restoreOwnerScroll(ownerDocument, x, y) {
  if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
    ownerDocument.defaultView.scrollTo(x, y);
  }
};

var cloneCanvasContents = function cloneCanvasContents(canvas, clonedCanvas) {
  try {
    if (clonedCanvas) {
      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;
      var ctx = canvas.getContext('2d');
      var clonedCtx = clonedCanvas.getContext('2d');

      if (ctx) {
        clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
      } else {
        clonedCtx.drawImage(canvas, 0, 0);
      }
    }
  } catch (e) {}
};

var inlinePseudoElement = function inlinePseudoElement(node, clone, style, contentItems, pseudoElt) {
  if (!style || !style.content || style.content === 'none' || style.content === '-moz-alt-content' || style.display === 'none') {
    return;
  }

  var anonymousReplacedElement = clone.ownerDocument.createElement('html2canvaspseudoelement');
  (0, _Util.copyCSSStyles)(style, anonymousReplacedElement);

  if (contentItems) {
    var len = contentItems.length;

    for (var i = 0; i < len; i++) {
      var item = contentItems[i];

      switch (item.type) {
        case _PseudoNodeContent.PSEUDO_CONTENT_ITEM_TYPE.IMAGE:
          var img = clone.ownerDocument.createElement('img');
          img.src = (0, _background.parseBackgroundImage)("url(".concat(item.value, ")"))[0].args[0];
          img.style.opacity = '1';
          anonymousReplacedElement.appendChild(img);
          break;

        case _PseudoNodeContent.PSEUDO_CONTENT_ITEM_TYPE.TEXT:
          anonymousReplacedElement.appendChild(clone.ownerDocument.createTextNode(item.value));
          break;
      }
    }
  }

  anonymousReplacedElement.className = "".concat(PSEUDO_HIDE_ELEMENT_CLASS_BEFORE, " ").concat(PSEUDO_HIDE_ELEMENT_CLASS_AFTER);
  clone.className += pseudoElt === PSEUDO_BEFORE ? " ".concat(PSEUDO_HIDE_ELEMENT_CLASS_BEFORE) : " ".concat(PSEUDO_HIDE_ELEMENT_CLASS_AFTER);

  if (pseudoElt === PSEUDO_BEFORE) {
    clone.insertBefore(anonymousReplacedElement, clone.firstChild);
  } else {
    clone.appendChild(anonymousReplacedElement);
  }

  return anonymousReplacedElement;
};

var URL_REGEXP = /^url\((.+)\)$/i;
var PSEUDO_BEFORE = ':before';
var PSEUDO_AFTER = ':after';
var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';
var PSEUDO_HIDE_ELEMENT_STYLE = "{\n    content: \"\" !important;\n    display: none !important;\n}";

var createPseudoHideStyles = function createPseudoHideStyles(body) {
  createStyles(body, ".".concat(PSEUDO_HIDE_ELEMENT_CLASS_BEFORE).concat(PSEUDO_BEFORE).concat(PSEUDO_HIDE_ELEMENT_STYLE, "\n         .").concat(PSEUDO_HIDE_ELEMENT_CLASS_AFTER).concat(PSEUDO_AFTER).concat(PSEUDO_HIDE_ELEMENT_STYLE));
};

var createStyles = function createStyles(body, styles) {
  var style = body.ownerDocument.createElement('style');
  style.innerHTML = styles;
  body.appendChild(style);
};

var initNode = function initNode(_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      element = _ref2[0],
      x = _ref2[1],
      y = _ref2[2];

  element.scrollLeft = x;
  element.scrollTop = y;
};

var generateIframeKey = function generateIframeKey() {
  return Math.ceil(Date.now() + Math.random() * 10000000).toString(16);
};

var DATA_URI_REGEXP = /^data:text\/(.+);(base64)?,(.*)$/i;

var getIframeDocumentElement = function getIframeDocumentElement(node, options) {
  try {
    return Promise.resolve(node.contentWindow.document.documentElement);
  } catch (e) {
    return options.proxy ? (0, _Proxy.Proxy)(node.src, options).then(function (html) {
      var match = html.match(DATA_URI_REGEXP);

      if (!match) {
        return Promise.reject();
      }

      return match[2] === 'base64' ? window.atob(decodeURIComponent(match[3])) : decodeURIComponent(match[3]);
    }).then(function (html) {
      return createIframeContainer(node.ownerDocument, (0, _Bounds.parseBounds)(node, 0, 0)).then(function (cloneIframeContainer) {
        var cloneWindow = cloneIframeContainer.contentWindow;
        var documentClone = cloneWindow.document;
        documentClone.open();
        documentClone.write(html);
        var iframeLoad = iframeLoader(cloneIframeContainer).then(function () {
          return documentClone.documentElement;
        });
        documentClone.close();
        return iframeLoad;
      });
    }) : Promise.reject();
  }
};

var createIframeContainer = function createIframeContainer(ownerDocument, bounds) {
  var cloneIframeContainer = ownerDocument.createElement('iframe');
  cloneIframeContainer.className = 'html2canvas-container';
  cloneIframeContainer.style.visibility = 'hidden';
  cloneIframeContainer.style.position = 'fixed';
  cloneIframeContainer.style.left = '-10000px';
  cloneIframeContainer.style.top = '0px';
  cloneIframeContainer.style.border = '0';
  cloneIframeContainer.width = bounds.width.toString();
  cloneIframeContainer.height = bounds.height.toString();
  cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it

  cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, 'true');

  if (!ownerDocument.body) {
    return Promise.reject(process.env.NODE_ENV !== "production" ? "Body element not found in Document that is getting rendered" : '');
  }

  ownerDocument.body.appendChild(cloneIframeContainer);
  return Promise.resolve(cloneIframeContainer);
};

var iframeLoader = function iframeLoader(cloneIframeContainer) {
  var cloneWindow = cloneIframeContainer.contentWindow;
  var documentClone = cloneWindow.document;
  return new Promise(function (resolve, reject) {
    cloneWindow.onload = cloneIframeContainer.onload = documentClone.onreadystatechange = function () {
      var interval = setInterval(function () {
        if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {
          clearInterval(interval);
          resolve(cloneIframeContainer);
        }
      }, 50);
    };
  });
};

var cloneWindow = function cloneWindow(ownerDocument, bounds, referenceElement, options, logger, renderer) {
  var cloner = new DocumentCloner(referenceElement, options, logger, false, renderer);
  var scrollX = ownerDocument.defaultView.pageXOffset;
  var scrollY = ownerDocument.defaultView.pageYOffset;
  return createIframeContainer(ownerDocument, bounds).then(function (cloneIframeContainer) {
    var cloneWindow = cloneIframeContainer.contentWindow;
    var documentClone = cloneWindow.document;
    /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */

    var iframeLoad = iframeLoader(cloneIframeContainer).then(function () {
      cloner.scrolledElements.forEach(initNode);
      cloneWindow.scrollTo(bounds.left, bounds.top);

      if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (cloneWindow.scrollY !== bounds.top || cloneWindow.scrollX !== bounds.left)) {
        documentClone.documentElement.style.top = -bounds.top + 'px';
        documentClone.documentElement.style.left = -bounds.left + 'px';
        documentClone.documentElement.style.position = 'absolute';
      }

      var result = Promise.resolve([cloneIframeContainer, cloner.clonedReferenceElement, cloner.resourceLoader]);
      var onclone = options.onclone;
      return cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement || cloner.clonedReferenceElement instanceof ownerDocument.defaultView.HTMLElement || cloner.clonedReferenceElement instanceof HTMLElement ? typeof onclone === 'function' ? Promise.resolve().then(function () {
        return onclone(documentClone);
      }).then(function () {
        return result;
      }) : result : Promise.reject(process.env.NODE_ENV !== "production" ? "Error finding the ".concat(referenceElement.nodeName, " in the cloned document") : '');
    });
    documentClone.open();
    documentClone.write("".concat(serializeDoctype(document.doctype), "<html></html>")); // Chrome scrolls the parent document for some reason after the write to the cloned window???

    restoreOwnerScroll(referenceElement.ownerDocument, scrollX, scrollY);
    documentClone.replaceChild(documentClone.adoptNode(cloner.documentElement), documentClone.documentElement);
    documentClone.close();
    return iframeLoad;
  });
};

exports.cloneWindow = cloneWindow;

var serializeDoctype = function serializeDoctype(doctype) {
  var str = '';

  if (doctype) {
    str += '<!DOCTYPE ';

    if (doctype.name) {
      str += doctype.name;
    }

    if (doctype.internalSubset) {
      str += doctype.internalSubset;
    }

    if (doctype.publicId) {
      str += "\"".concat(doctype.publicId, "\"");
    }

    if (doctype.systemId) {
      str += "\"".concat(doctype.systemId, "\"");
    }

    str += '>';
  }

  return str;
};