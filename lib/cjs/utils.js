"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePosition = exports.getRefWidthHeight = void 0;
var percentToPx = function (percent, total) {
    var decimal = parseInt(percent.replace("%", "")) / 100;
    return total * decimal;
};
var pxStringToInt = function (px) { return parseInt(px.replace("px", "")); };
var isPercent = function (val) { return val.match(/^[0-9]{1,3}%$/g); };
var isPx = function (val) { return val.match(/^[0-9]px$/g); };
var getRefWidthHeight = function (ref) {
    if (ref === null || ref === void 0 ? void 0 : ref.current) {
        return [ref.current.offsetWidth, ref.current.offsetHeight];
    }
    return [0, 0];
};
exports.getRefWidthHeight = getRefWidthHeight;
var getPositionFromPercentage = function (value, containerWidth, itemWidth) {
    var percentContainerWidth = percentToPx(value, containerWidth);
    var percentItemWidth = percentToPx(value, itemWidth);
    return (percentItemWidth - percentContainerWidth) * -1;
};
var sanitizePosition = function (position, container, dragItem) {
    var x = position.x, y = position.y;
    var containerWidth = container.containerWidth, containerHeight = container.containerHeight;
    var dragItemWidth = dragItem.dragItemWidth, dragItemHeight = dragItem.dragItemHeight;
    var posX;
    var posY;
    if (typeof x === "string") {
        if (isPercent(x))
            posX = getPositionFromPercentage(x, containerWidth, dragItemWidth);
        else if (isPx(x))
            posX = pxStringToInt(x);
        else
            posX = 0;
    }
    else
        posX = x;
    if (typeof y === "string") {
        if (isPercent(y))
            posY = getPositionFromPercentage(y, containerHeight, dragItemHeight);
        else if (isPx(y))
            posY = pxStringToInt(y);
        else
            posY = 0;
    }
    else
        posY = y;
    return { x: posX, y: posY };
};
exports.sanitizePosition = sanitizePosition;
