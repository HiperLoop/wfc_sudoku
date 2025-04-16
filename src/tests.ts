import { cell } from "./board.js"

/* export const test_one:cell[][] = [
[{num:8, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:3, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:6, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:7, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:9, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:2, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:5, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:7, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:4, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:5, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:7, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:1, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:3, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:1, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:6, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:8, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:8, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:5, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:1, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}],
[{num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:9, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:4, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}, {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false}]];
 */

export const test_one:number[][] = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 6, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 9, 0, 2, 0, 0],

    [0, 5, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 4, 5, 7, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 3, 0],

    [0, 0, 1, 0, 0, 0, 0, 6, 8],
    [0, 0, 8, 5, 0, 0, 0, 1, 0],
    [0, 9, 0, 0, 0, 0, 4, 0, 0]];

export const als:number[][] = [
    [6, 0, 0, 0, 9, 7, 0, 3, 0],
    [0, 0, 0, 0, 2, 0, 4, 0, 0],
    [3, 0, 0, 6, 0, 0, 0, 0, 7],

    [0, 0, 3, 0, 0, 0, 0, 5, 0],
    [5, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 8, 0, 0, 0, 0, 9, 0, 0],

    [7, 0, 0, 8, 0, 6, 0, 0, 1],
    [0, 0, 9, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 3, 0, 0, 0, 0, 5]];

export const twoWays:number[][] = [
    [2, 9, 5, 7, 4, 3, 8, 6, 4],
    [4, 3, 1, 8, 6, 5, 9, 0, 0],
    [8, 7, 6, 1, 9, 2, 5, 4, 3],
    [3, 8, 7, 4, 5, 9, 2, 1, 6],
    [6, 1, 2, 3, 8, 7, 4, 9, 5],
    [5, 4, 9, 2, 1, 6, 7, 3, 8],
    [7, 6, 3, 5, 2, 4, 1, 8, 9],
    [9, 2, 8, 6, 7, 1, 3, 5, 4],
    [1, 5, 4, 9, 3, 8, 6, 0, 0]];

export const easy:number[][] = [
    [0, 8, 0, 0, 0, 0, 2, 1, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 1, 0, 5, 6, 0],
    [7, 2, 1, 0, 9, 8, 3, 0, 5],
    [5, 3, 9, 0, 7, 4, 6, 0, 1],
    [8, 0, 4, 0, 0, 0, 0, 0, 7],
    [0, 9, 8, 0, 0, 0, 0, 0, 0],
    [0, 5, 6, 9, 0, 7, 0, 0, 0],
    [0, 7, 0, 0, 6, 5, 1, 0, 2]];

export const medium:number[][] = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 0, 0, 0, 0, 0],
    [0, 6, 0, 9, 3, 5, 0, 0, 0],
    [0, 0, 2, 3, 4, 0, 0, 6, 0],
    [3, 0, 0, 0, 0, 1, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 8, 4],
    [0, 5, 0, 0, 6, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 2, 0, 9, 0],
    [8, 0, 0, 0, 0, 0, 0, 7, 1]];

export const sofia:number[][][] = [
    [[0, 0, 0, 4, 9, 0, 8, 0, 0],
    [0, 7, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 9, 8, 7, 2, 0, 0, 3],
    [4, 0, 2, 3, 6, 0, 1, 8, 9],
    [0, 0, 8, 9, 4, 5, 2, 3, 7],
    [9, 3, 0, 2, 1, 8, 6, 4, 5],
    [7, 4, 0, 1, 0, 9, 5, 6, 8],
    [0, 9, 1, 6, 0, 3, 7, 2, 0],
    [0, 8, 6, 7, 5, 4, 3, 0, 0]],

    [[0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]],

    [[0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]],

    [[0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]]
];

export const shion:number[][] = [
    [7, 0, 0, 2, 6, 0, 0, 5, 0],
    [0, 0, 5, 0, 0, 3, 0, 0, 7],
    [0, 9, 0, 0, 8, 7, 0, 0, 0],
    [1, 0, 0, 0, 4, 0, 7, 9, 0],
    [2, 0, 7, 1, 0, 9, 3, 0, 6],
    [0, 4, 9, 0, 2, 0, 0, 0, 8],
    [0, 0, 0, 6, 3, 0, 0, 7, 0],
    [9, 0, 0, 8, 0, 0, 4, 0, 0],
    [0, 7, 0, 0, 1, 4, 0, 0, 3]];

export function cellBoardFromValues(values:number[][]) {
    let board:cell[][] = [];
    for(let i = 0; i < values[0].length; ++i) {
        board[i] = [];
        for(let j = 0; j < values[0].length; ++j) {
            board[i][j] = {num:values[i][j], possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false, given:values[i][j] > 0};
        }
    }
    return board;
}