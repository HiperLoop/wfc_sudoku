import { resize_canvas, drawBoard, coordsFromClick, currentPalette, colourInit } from "./canvas.js";
import { board, cell, empty_grid, cellBoardFromValues } from "./board.js";
import { easy , medium, sofia, shion, test_one, als, twoWays } from "./tests.js";
import { eventListeners_init } from "./event_listeners.js";

let cnv:HTMLCanvasElement;
let gridSize = 9;
let grid:cell[][] = [[]];
let playBoard:board;

window.onload = function() {
    //sudoku tests
    grid= cellBoardFromValues(medium);
    //grid= cellBoardFromValues(twoWays);
    //grid= cellBoardFromValues(sofia[0]);

    playBoard = {grid:grid, gridSize:gridSize, unsolvedSquares:new Set<number>, selectedCells:new Set<number>}; //create board
    cnv = <HTMLCanvasElement> document.getElementById("myCanvas");
    eventListeners_init(cnv, playBoard, [window.innerWidth, window.innerHeight]); //Initialise event listeners for user input handling
    colourInit(); //set colours for the page
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard); //resize canvas and draw grid
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard); //resize canvas and draw grid when window size changes
}