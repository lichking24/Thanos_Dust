'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeParser = void 0;

var _StackingContext = _interopRequireDefault(require("./StackingContext"));

var _NodeContainer = _interopRequireDefault(require("./NodeContainer"));

var _TextContainer = _interopRequireDefault(require("./TextContainer"));

var _Input = require("./Input");

var _ListItem = require("./ListItem");

var _listStyle = require("./parsing/listStyle");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NodeParser = function NodeParser(node, resourceLoader, logger) {
  if (process.env.NODE_ENV !== "production") {
    logger.log("Starting node parsing");
  }

  var index = 0;
  var container = new _NodeContainer.default(node, null, resourceLoader, index++);
  var stack = new _StackingContext.default(container, null, true);
  parseNodeTree(node, container, stack, resourceLoader, index);

  if (process.env.NODE_ENV !== "production") {
    logger.log("Finished parsing node tree");
  }

  return stack;
};

exports.NodeParser = NodeParser;
var IGNORED_NODE_NAMES = ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'];

var parseNodeTree = function parseNodeTree(node, parent, stack, resourceLoader, index) {
  if (process.env.NODE_ENV !== "production" && index > 50000) {
    throw new Error("Recursion error while parsing node tree");
  }

  for (var childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
    nextNode = childNode.nextSibling;
    var defaultView = childNode.ownerDocument.defaultView;

    if (childNode instanceof defaultView.Text || childNode instanceof Text || defaultView.parent && childNode instanceof defaultView.parent.Text) {
      if (childNode.data.trim().length > 0) {
        parent.childNodes.push(_TextContainer.default.fromTextNode(childNode, parent));
      }
    } else if (childNode instanceof defaultView.HTMLElement || childNode instanceof HTMLElement || defaultView.parent && childNode instanceof defaultView.parent.HTMLElement) {
      if (IGNORED_NODE_NAMES.indexOf(childNode.nodeName) === -1) {
        var container = new _NodeContainer.default(childNode, parent, resourceLoader, index++);

        if (container.isVisible()) {
          if (childNode.tagName === 'INPUT') {
            // $FlowFixMe
            (0, _Input.inlineInputElement)(childNode, container);
          } else if (childNode.tagName === 'TEXTAREA') {
            // $FlowFixMe
            (0, _Input.inlineTextAreaElement)(childNode, container);
          } else if (childNode.tagName === 'SELECT') {
            // $FlowFixMe
            (0, _Input.inlineSelectElement)(childNode, container);
          } else if (container.style.listStyle && container.style.listStyle.listStyleType !== _listStyle.LIST_STYLE_TYPE.NONE) {
            (0, _ListItem.inlineListItemElement)(childNode, container, resourceLoader);
          }

          var SHOULD_TRAVERSE_CHILDREN = childNode.tagName !== 'TEXTAREA';
          var treatAsRealStackingContext = createsRealStackingContext(container, childNode);

          if (treatAsRealStackingContext || createsStackingContext(container)) {
            // for treatAsRealStackingContext:false, any positioned descendants and descendants
            // which actually create a new stacking context should be considered part of the parent stacking context
            var parentStack = treatAsRealStackingContext || container.isPositioned() ? stack.getRealParentStackingContext() : stack;
            var childStack = new _StackingContext.default(container, parentStack, treatAsRealStackingContext);
            parentStack.contexts.push(childStack);

            if (SHOULD_TRAVERSE_CHILDREN) {
              parseNodeTree(childNode, container, childStack, resourceLoader, index);
            }
          } else {
            stack.children.push(container);

            if (SHOULD_TRAVERSE_CHILDREN) {
              parseNodeTree(childNode, container, stack, resourceLoader, index);
            }
          }
        }
      }
    } else if (childNode instanceof defaultView.SVGSVGElement || childNode instanceof SVGSVGElement || defaultView.parent && childNode instanceof defaultView.parent.SVGSVGElement) {
      var _container = new _NodeContainer.default(childNode, parent, resourceLoader, index++);

      var _treatAsRealStackingContext = createsRealStackingContext(_container, childNode);

      if (_treatAsRealStackingContext || createsStackingContext(_container)) {
        // for treatAsRealStackingContext:false, any positioned descendants and descendants
        // which actually create a new stacking context should be considered part of the parent stacking context
        var _parentStack = _treatAsRealStackingContext || _container.isPositioned() ? stack.getRealParentStackingContext() : stack;

        var _childStack = new _StackingContext.default(_container, _parentStack, _treatAsRealStackingContext);

        _parentStack.contexts.push(_childStack);
      } else {
        stack.children.push(_container);
      }
    }
  }
};

var createsRealStackingContext = function createsRealStackingContext(container, node) {
  return container.isRootElement() || container.isPositionedWithZIndex() || container.style.opacity < 1 || container.isTransformed() || isBodyWithTransparentRoot(container, node);
};

var createsStackingContext = function createsStackingContext(container) {
  return container.isPositioned() || container.isFloating();
};

var isBodyWithTransparentRoot = function isBodyWithTransparentRoot(container, node) {
  return node.nodeName === 'BODY' && container.parent instanceof _NodeContainer.default && container.parent.style.background.backgroundColor.isTransparent();
};