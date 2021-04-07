declare type InitialPosition = {
    x: number | string;
    y: number | string;
};
declare type Ref = {
    current: HTMLElement;
};
declare const useDragWithin: (dragItemRef: Ref, containerRef: Ref, initialPosition?: InitialPosition | undefined, condition?: boolean) => ({
    x: number;
    y: number;
} | ((event: MouseEvent) => void))[];
export default useDragWithin;
