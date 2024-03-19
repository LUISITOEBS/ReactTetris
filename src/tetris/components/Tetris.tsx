import { useRef } from 'react';
import { useTetris } from '../hooks/useTetris';

const size = {
    width: 720,
    height: 960
}

export const Tetris = () => {
    const { width, height } = size;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useTetris( canvasRef, { x: width, y: height } );

    return (
        <canvas className='tetris-board' ref={canvasRef} width={ width } height={ height } />
    )
}
