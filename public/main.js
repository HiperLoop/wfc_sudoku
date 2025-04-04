import { resize_canvas, drawBoard } from "./canvas.js";
import { solve } from "./solver.js";
import { test_one } from "./tests.js";
let cnv;
let gridSize = 9;
let board = [[]];
window.onload = function () {
    //board = populateBoard(gridSize);
    board = test_one;
    //board = cellBoardFromValues(easy);
    //console.log("works");
    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => { solve(board, gridSize, [window.innerWidth, window.innerHeight], cnv); drawBoard(board, gridSize, cnv, [window.innerWidth, window.innerHeight], true); });
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
};
window.onresize = function () {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
};
