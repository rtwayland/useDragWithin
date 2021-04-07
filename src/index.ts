import { useState, useEffect } from "react";
import { getRefWidthHeight, sanitizePosition } from "./utils";

type Position = {
  x: number | null;
  y: number | null;
};

type InitialPosition = {
  x: number | string;
  y: number | string;
};

type Ref = { current: HTMLElement };

const useDragWithin = (
  dragItemRef: Ref,
  containerRef: Ref,
  initialPosition?: InitialPosition,
  condition: boolean = true
) => {
  const positionReset = { x: null, y: null };
  const [pristine, setPristine] = useState(true);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState<Position>(positionReset);

  useEffect(() => {
    if (condition) {
      const [containerWidth, containerHeight] = getRefWidthHeight(containerRef);
      const [dragItemWidth, dragItemHeight] = getRefWidthHeight(dragItemRef);
      const hasDimensions =
        containerWidth && dragItemWidth && containerHeight && dragItemHeight;
      if (pristine && hasDimensions && initialPosition) {
        const sanitized = sanitizePosition(
          initialPosition,
          { containerWidth, containerHeight },
          { dragItemWidth, dragItemHeight }
        );
        if (position.x !== sanitized.x || position.y !== sanitized.y)
          setPosition(sanitized);
      }
    }
  }, [condition, containerRef, dragItemRef, initialPosition, pristine]);

  const handleMouseDown = (event: MouseEvent) => {
    if (condition) {
      const { clientX, clientY } = event;
      setStartPosition({ x: clientX, y: clientY });
      if (pristine) setPristine(false);
    }
  };

  const getValidPosition = (xDrag: number, yDrag: number) => {
    const [containerWidth, containerHeight] = getRefWidthHeight(containerRef);
    const [dragItemWidth, dragItemHeight] = getRefWidthHeight(dragItemRef);
    const { x, y } = position;
    const maxX = -(dragItemWidth - containerWidth);
    const maxY = -(dragItemHeight - containerHeight);
    const newX = x + xDrag;
    const newY = y + yDrag;
    let validX = newX;
    let validY = newY;
    if (newX > 0) validX = 0;
    if (newY > 0) validY = 0;
    if (newX < maxX) validX = maxX;
    if (newY < maxY) validY = maxY;

    return { x: validX, y: validY };
  };

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { x: startX, y: startY } = startPosition;
    if (condition && mouseIsDown && startX && startY) {
      const xDragAmount = clientX - startX;
      const yDragAmount = clientY - startY;
      const updatedPosition = getValidPosition(xDragAmount, yDragAmount);
      setPosition(updatedPosition);
    }
  };

  useEffect(() => {
    const removeMouseMove = () =>
      document.removeEventListener("mousemove", handleMouseMove, false);

    if (condition && mouseIsDown)
      document.addEventListener("mousemove", handleMouseMove, false);
    else removeMouseMove();

    return removeMouseMove;
  }, [mouseIsDown]);

  const documentMouseDown = () => setMouseIsDown(true);
  const documentMouseUp = () => {
    setMouseIsDown(false);
    setStartPosition(positionReset);
  };

  useEffect(() => {
    const removeListeners = () => {
      document.removeEventListener("mousedown", documentMouseDown, false);
      document.removeEventListener("mouseup", documentMouseUp, false);
    };

    if (condition) {
      document.addEventListener("mousedown", documentMouseDown, false);
      document.addEventListener("mouseup", documentMouseUp, false);
    } else {
      removeListeners();
    }

    return removeListeners;
  }, []);

  return [position, handleMouseDown];
};

export default useDragWithin;
