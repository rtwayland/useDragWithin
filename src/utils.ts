type Position = {
  x: number;
  y: number;
};

type InitialPosition = {
  x: number | string;
  y: number | string;
};

type Ref = { current: HTMLElement };

type Container = {
  containerWidth: number;
  containerHeight: number;
};

type DragItem = {
  dragItemWidth: number;
  dragItemHeight: number;
};

const percentToPx = (percent: string, total: number) => {
  const decimal = parseInt(percent.replace("%", "")) / 100;
  return total * decimal;
};

const pxStringToInt = (px: string) => parseInt(px.replace("px", ""));

const isPercent = (val: string) => val.match(/^[0-9]{1,3}%$/g);
const isPx = (val: string) => val.match(/^[0-9]px$/g);

export const getRefWidthHeight = (ref: Ref) => {
  if (ref?.current) {
    return [ref.current.offsetWidth, ref.current.offsetHeight];
  }
  return [0, 0];
};

const getPositionFromPercentage = (
  value: string,
  containerWidth: number,
  itemWidth: number
) => {
  const percentContainerWidth = percentToPx(value, containerWidth);
  const percentItemWidth = percentToPx(value, itemWidth);
  return (percentItemWidth - percentContainerWidth) * -1;
};

export const sanitizePosition = (
  position: InitialPosition,
  container: Container,
  dragItem: DragItem
): Position => {
  const { x, y } = position;
  const { containerWidth, containerHeight } = container;
  const { dragItemWidth, dragItemHeight } = dragItem;
  let posX: number;
  let posY: number;
  if (typeof x === "string") {
    if (isPercent(x))
      posX = getPositionFromPercentage(x, containerWidth, dragItemWidth);
    else if (isPx(x)) posX = pxStringToInt(x);
    else posX = 0;
  } else posX = x;
  if (typeof y === "string") {
    if (isPercent(y))
      posY = getPositionFromPercentage(y, containerHeight, dragItemHeight);
    else if (isPx(y)) posY = pxStringToInt(y);
    else posY = 0;
  } else posY = y;

  return { x: posX, y: posY };
};
