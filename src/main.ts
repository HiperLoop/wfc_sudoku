import { resize_canvas, drawBoard, coordsFromClick } from "./canvas.js";
import { board, cell, empty_grid, cellBoardFromValues } from "./board.js";
import { generateDegreesOfFreedom, solve } from "./solver.js";
import { easy , medium, sofia, shion, test_one, als, twoWays } from "./tests.js";
import { eventListeners_init } from "./event_listeners.js";

let cnv:HTMLCanvasElement;
let gridSize = 9;
let grid:cell[][] = [[]];
let playBoard:board;

window.onload = function() {
    //board = populateBoard(gridSize);
    grid= cellBoardFromValues(medium);
    //grid= cellBoardFromValues(twoWays);
    //grid= cellBoardFromValues(sofia[0]);
    playBoard = {grid:grid, gridSize:gridSize, unsolvedSquares:new Set<number>};
    cnv = <HTMLCanvasElement> document.getElementById("myCanvas");
    eventListeners_init(cnv, playBoard);
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
}