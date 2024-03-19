import { useEffect, useState } from 'react';
import { pieces } from '../helpers/pieces';
import { pieceProps, pieceShape, positionShape, sizeBoard } from '../interfaces/interfaces';
import { getEmptyMatrix } from '../helpers/functions';

const PIECE_WIDTH = 60;
const PIECE_HEIGHT = 60;

export const useTetris = ( canvasRef: React.RefObject<HTMLCanvasElement>, canvasSize: sizeBoard ) => {

    const [boardTetris, setBoardTetris] = useState<number[][]>( () => getEmptyMatrix( canvasSize.y / PIECE_HEIGHT, canvasSize.x / PIECE_WIDTH ) );
    
    const [actualPiece, setActualPiece] = useState({
        position: {
            x: 300,
            y: 0
        },
        piece: pieces[Math.floor( Math.random() * pieces.length )]
    })

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        setCanvas( canvasRef.current );
    }, [ canvasRef ]);

    useEffect(() => {
        if(!canvas) return;
        setContext( canvas.getContext('2d') );
    }, [canvas]);

    useEffect(() => {
        checkGameStatus();
    }, [context]);

    useEffect(() => {
        
        // const timer = setTimeout(() => {
        //     makeMovement('down', actualPiece);
        // }, 500);
        // return () => clearTimeout(timer);
    }, [ actualPiece ])
    

    useEffect(() => {
        checkGameStatus();
    }, [ actualPiece ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent ) => {
            switch (event.key) {
                case 'ArrowDown':
                    makeMovement('down', actualPiece);
                break;
                case 'ArrowLeft':
                    makeMovement('left', actualPiece);
                break;
                case 'ArrowRight':
                    makeMovement('right', actualPiece);
                break;
                case 'r':
                    rotatePiece( actualPiece )
                break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [ actualPiece ]);
    
    
    const paintBoard = () => {
        if(!context) return;
        context.clearRect(0, 0, canvas!.width, canvas!.height);
        context.strokeStyle  = 'black';
        context.fillStyle = 'green';
        context.lineWidth = 2;

        let positionY = 0;
        let positionX = 0;
        boardTetris.forEach( (row: number[]) => {
            positionX = 0;
            row.forEach((item) => {
                if(item !== 0){
                    context.fillRect( positionX, positionY, PIECE_WIDTH, PIECE_HEIGHT );
                    context.strokeRect( positionX, positionY, PIECE_WIDTH, PIECE_HEIGHT );
                }
                positionX += PIECE_WIDTH;
            });
            positionY += PIECE_HEIGHT;
        });
    }

    const checkGameStatus = () => {
        const { piece, position } = actualPiece;
        
        if ( !checkCoalitions( piece.shape, position ) ) {
            paintBoard();
            paintActualPiece();
            return;
        }

        solidifyPiece();
        
        if( checkStatusBoard() ){
            gameOver();
            return;
        }
        resetPiece();
    }
    
    const paintActualPiece  = () => {
        if(!context) return;
        let positionY = actualPiece.position.y;
        let positionX = actualPiece.position.x;
        actualPiece.piece.shape.forEach( (row: number[]) => {
            positionX = actualPiece.position.x;
            row.forEach((item) => {
                if(item !== 0){
                    context.fillStyle = actualPiece.piece.color;
                    context.fillRect( positionX, positionY, PIECE_WIDTH, PIECE_HEIGHT );
                    context.strokeRect( positionX, positionY, PIECE_WIDTH, PIECE_HEIGHT );
                }
                positionX += PIECE_WIDTH;
            });
            positionY += PIECE_HEIGHT;
        });
    };

    const checkStatusBoard = () => {
        if( boardTetris[0].some(  item => item !== 0) ){
            return true;
        }
        const newBoard = [...boardTetris];
        boardTetris.forEach( (row, index) => {
            if( row.every(item => item !== 0) ) {
                newBoard.splice(index, 1);
                const newRow = Array(boardTetris[0].length).fill(0);
                newBoard.unshift( newRow );
            }
        });
        setBoardTetris(newBoard);
        return false;
    }

    const checkCoalitions = ( currentPiece: number[][], position: positionShape ) => {  
        
        if(!context) return;
        let boardPositionX = position.x / PIECE_WIDTH;
        let boardPositionY = position.y / PIECE_HEIGHT;
        let positionX = boardPositionX;
        let positionY = boardPositionY;

        return currentPiece.some( (row : any) => {
            positionX = boardPositionX;
            positionY += 1;
            return row.some( (item : any) => {
                positionX += 1;
                return boardTetris[positionY - 1] 
                ? item !== 0 && boardTetris[positionY - 1 ][positionX - 1 ] !== 0 
                : true 
            });
        });
    }

    const solidifyPiece = () => {
        const { position, piece } = actualPiece;
        let boardPositionX = position.x / PIECE_WIDTH;
        let boardPositionY = position.y / PIECE_HEIGHT;
        let positionX = boardPositionX;
        let positionY = boardPositionY - 1;

        piece.shape.forEach( (row : any) => {
            positionX = boardPositionX;
            row.forEach( ( item: any) => {
                if(item !== 0 && positionY >= 0){
                    boardTetris[positionY][positionX] = 1;
                }
                positionX += 1;
            })
            positionY += 1;
        });
    }

    const makeMovement = ( direction: string, currentPiece: any ) => {
        const { position, piece } = currentPiece;        
        const currentPieceWith =  piece.shape[0].length * PIECE_WIDTH;
        const maxWidth = position.x + PIECE_WIDTH + currentPieceWith;
        
        switch ( direction ) {
            case 'down':
                updatePiece( position.x, position.y + PIECE_HEIGHT, piece );
            break;
            case 'left':
                if( position.x - PIECE_WIDTH < 0) return;
                updatePiece( position.x - PIECE_WIDTH, position.y, piece );
            break;
            case 'right':
                if( maxWidth > canvasSize.x ) return;
                console.log('Moviendo a la derecha');
                
                updatePiece( position.x + PIECE_WIDTH, position.y, piece );
            break;
        }
    }

    const rotatePiece = ( currentPiece: any ) => {
        const { position, piece } = currentPiece;
        const matrixWidth = piece.shape.length;
        const matrixHeight = piece.shape[0].length;

        let newPiece = getEmptyMatrix(matrixHeight, matrixWidth);  
    
        let positionY = matrixHeight - 1;
        newPiece.forEach((row, indexY) => {
            row.forEach( (_, indexX) => {
                newPiece[indexY][indexX] = piece.shape[indexX][positionY - indexY];
            });
        });

        let piecePosition = {
            x: position.x,
            y: position.y
        }

        const newWidth = newPiece[0].length * PIECE_WIDTH;
        if( newWidth + position.x >  canvasSize.x ){
            piecePosition.x = (matrixHeight * PIECE_WIDTH) - newWidth;
        }

        if(!checkCoalitions( newPiece, piecePosition )){
            console.log( piecePosition );
            
            updatePiece(piecePosition.x, piecePosition.y, { shape: newPiece, color: currentPiece.piece.color });
        }
        
    }

    const updatePiece = ( x: number, y: number, piece: any ) => {
        setActualPiece(prevState => ({
            ...prevState,
            position: {
                x: x,
                y: y
            },
            piece
        }));
    }

    const resetPiece = () => {
        updatePiece( 300, 0, pieces[Math.floor(Math.random() * pieces.length)] );
    }


    const gameOver = () => {
        alert('Se acabo');
        setBoardTetris( getEmptyMatrix( canvasSize.y / PIECE_HEIGHT, canvasSize.x / PIECE_WIDTH )  );
        resetPiece();
    }
    
    return {
        boardTetris
    }
}
