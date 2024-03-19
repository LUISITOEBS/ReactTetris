export const getEmptyMatrix = (height: number, width: number) => {
    let newMatrix: number[][] = [];
    for (let i = 0; i < height; i++) {
        newMatrix[i] = [];
        for(let j = 0; j < width; j++) {
            newMatrix[i][j] = 0;
        }
    }
    return newMatrix;
}