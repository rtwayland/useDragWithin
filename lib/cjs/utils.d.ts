declare type Position = {
    x: number;
    y: number;
};
declare type InitialPosition = {
    x: number | string;
    y: number | string;
};
declare type Ref = {
    current: HTMLElement;
};
declare type Container = {
    containerWidth: number;
    containerHeight: number;
};
declare type DragItem = {
    dragItemWidth: number;
    dragItemHeight: number;
};
export declare const getRefWidthHeight: (ref: Ref) => number[];
export declare const sanitizePosition: (position: InitialPosition, container: Container, dragItem: DragItem) => Position;
export {};
