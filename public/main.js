import { resize_canvas } from "./canvas.js";
import { cellBoardFromValues } from "./board.js";
import { medium } from "./tests.js";
import { eventListeners_init } from "./event_listeners.js";
let cnv;
let gridSize = 9;
let grid = [[]];
let playBoard;
window.onload = function () {
    //board = populateBoard(gridSize);
    grid = cellBoardFromValues(medium);
    //grid= cellBoardFromValues(twoWays);
    //grid= cellBoardFromValues(sofia[0]);
    playBoard = { grid: grid, gridSize: gridSize, unsolvedSquares: new Set };
    cnv = document.getElementById("myCanvas");
    eventListeners_init(cnv, playBoard);
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
};
window.onresize = function () {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
};
