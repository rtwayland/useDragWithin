"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("./utils");
var useDragWithin = function (dragItemRef, containerRef, initialPosition, condition) {
    if (condition === void 0) { condition = true; }
    var positionReset = { x: null, y: null };
    var _a = react_1.useState(true), pristine = _a[0], setPristine = _a[1];
    var _b = react_1.useState(false), mouseIsDown = _b[0], setMouseIsDown = _b[1];
    var _c = react_1.useState({ x: 0, y: 0 }), position = _c[0], setPosition = _c[1];
    var _d = react_1.useState(positionReset), startPosition = _d[0], setStartPosition = _d[1];
    react_1.useEffect(function () {
        var _a = utils_1.getRefWidthHeight(containerRef), containerWidth = _a[0], containerHeight = _a[1];
        var _b = utils_1.getRefWidthHeight(dragItemRef), dragItemWidth = _b[0], dragItemHeight = _b[1];
        var hasDimensions = containerWidth && dragItemWidth && containerHeight && dragItemHeight;
        if (pristine && hasDimensions && initialPosition) {
            var sanitized = utils_1.sanitizePosition(initialPosition, { containerWidth: containerWidth, containerHeight: containerHeight }, { dragItemWidth: dragItemWidth, dragItemHeight: dragItemHeight });
            if (position.x !== sanitized.x || position.y !== sanitized.y)
                setPosition(sanitized);
        }
    }, [containerRef, dragItemRef, initialPosition, pristine]);
    var handleMouseDown = function (event) {
        if (condition) {
            var clientX = event.clientX, clientY = event.clientY;
            setStartPosition({ x: clientX, y: clientY });
            if (pristine)
                setPristine(false);
        }
    };
    var getValidPosition = function (xDrag, yDrag) {
        var _a = utils_1.getRefWidthHeight(containerRef), containerWidth = _a[0], containerHeight = _a[1];
        var _b = utils_1.getRefWidthHeight(dragItemRef), dragItemWidth = _b[0], dragItemHeight = _b[1];
        var x = position.x, y = position.y;
        var maxX = -(dragItemWidth - containerWidth);
        var maxY = -(dragItemHeight - containerHeight);
        var newX = x + xDrag;
        var newY = y + yDrag;
        var validX = newX;
        var validY = newY;
        if (newX > 0)
            validX = 0;
        if (newY > 0)
            validY = 0;
        if (newX < maxX)
            validX = maxX;
        if (newY < maxY)
            validY = maxY;
        return { x: validX, y: validY };
    };
    var handleMouseMove = function (event) {
        var clientX = event.clientX, clientY = event.clientY;
        var startX = startPosition.x, startY = startPosition.y;
        if (condition && mouseIsDown && startX && startY) {
            var xDragAmount = clientX - startX;
            var yDragAmount = clientY - startY;
            var updatedPosition = getValidPosition(xDragAmount, yDragAmount);
            setPosition(updatedPosition);
        }
    };
    react_1.useEffect(function () {
        var removeMouseMove = function () {
            return document.removeEventListener("mousemove", handleMouseMove, false);
        };
        if (condition && mouseIsDown)
            document.addEventListener("mousemove", handleMouseMove, false);
        else
            removeMouseMove();
        return removeMouseMove;
    }, [condition, mouseIsDown]);
    var documentMouseDown = function () { return setMouseIsDown(true); };
    var documentMouseUp = function () {
        setMouseIsDown(false);
        setStartPosition(positionReset);
    };
    react_1.useEffect(function () {
        var removeListeners = function () {
            document.removeEventListener("mousedown", documentMouseDown, false);
            document.removeEventListener("mouseup", documentMouseUp, false);
        };
        if (condition) {
            document.addEventListener("mousedown", documentMouseDown, false);
            document.addEventListener("mouseup", documentMouseUp, false);
        }
        else {
            removeListeners();
        }
        return removeListeners;
    }, [condition]);
    return [position, handleMouseDown];
};
exports.default = useDragWithin;
