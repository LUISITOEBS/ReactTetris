
export interface pieceShape {
    piece: number[][];
}

export interface positionShape {
    x: number;
    y: number;
}

export interface sizeBoard {
    x: number;
    y: number;
}

export interface pieceProps {
    position: positionShape;
    piece: number[][];
}