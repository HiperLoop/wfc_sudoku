import { resize_canvas } from "./canvas.js";
import { populateBoard } from "./board.js";
let cnv;
let gridSize = 9;
let board = [[]];
window.onload = function () {
    board = populateBoard(gridSize);
    //console.log("works");
    cnv = document.getElementById("myCanvas");
    //cnv.addEventListener("mouseup", (event) => {gameLoop(event, [window.innerWidth, window.innerHeight], cnv);});
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
};
window.onresize = function () {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
};
