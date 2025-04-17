var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { easy, medium, als } from "./tests.js";
import { blackPalette, coordsFromClick, copyToClipboard, currentPalette, drawBoard, setPalette, traditionalPalette, whitePalette } from "./canvas.js";
import { board_boardToString, board_deselectAll, board_generateUnsolvedSquares, board_givenGrid, board_lockGiven, board_selectCell, board_stringToGrid, cellBoardFromValues, empty_grid } from "./board.js";
import { generateDegreesOfFreedom, solve } from "./solver.js";
import { fixBoardToFitDifficulty, generateBoard } from "./generator.js";
//initializes all event listeners for user input
export function eventListeners_init(cnv, board, windowSize) {
    //canvas
    cnv.addEventListener("mousedown", (event) => {
        board_selectCell(board, coordsFromClick(event, board.gridSize, cnv, [window.innerWidth, window.innerHeight]), cnv, windowSize, event.ctrlKey);
        console.log(coordsFromClick(event, board.gridSize, cnv, [window.innerWidth, window.innerHeight]));
        console.log(board.selectedCells);
        drawBoard(board, cnv, windowSize);
    });
    //select colour theme
    const palette_options = document.getElementById("paletteSelector");
    palette_options ? palette_options.value = currentPalette == whitePalette ? "0" : "1" : null;
    palette_options ? palette_options.addEventListener("change", (event) => {
        switch (Number(palette_options.value)) {
            case 0:
                setPalette(whitePalette);
                break;
            case 1:
                setPalette(blackPalette);
                break;
            case 2:
                setPalette(traditionalPalette);
                break;
            default:
                console.error("Wrong palette option!");
        }
        drawBoard(board, cnv, windowSize);
    }) : console.error("Palette options event listener failed!");
    //solve
    const maxSolverIterations = 10;
    const useInference = true;
    const solve_button = document.getElementById("solve_button");
    solve_button ? solve_button.addEventListener("click", (event) => {
        board_generateUnsolvedSquares(board);
        generateDegreesOfFreedom(board);
        if (board.unsolvedSquares.size > 0) {
            board_lockGiven(board);
            solve(board, [window.innerWidth, window.innerHeight], cnv, maxSolverIterations, true, useInference);
        }
        drawBoard(board, cnv, [window.innerWidth, window.innerHeight], true);
    }) : console.error("Solve event listener failed!");
    //clear
    const clear_button = document.getElementById("clear_button");
    clear_button ? clear_button.addEventListener("click", (event) => { board.grid = cellBoardFromValues(empty_grid); drawBoard(board, cnv, [window.innerWidth, window.innerHeight], false); }) : console.error("Clear event listener failed!");
    //load
    const load_button = document.getElementById("load_button");
    const load_options = document.getElementById("load_options");
    const PGNinput = document.getElementById("PGN");
    var load_sudokus = [easy, medium, als, empty_grid];
    //deselct cells when text input selected
    PGNinput ? PGNinput.addEventListener("click", (event) => {
        board_deselectAll(board, cnv, windowSize);
    }) : console.error("PGN input load failed!");
    //if PGN input selected show text box
    load_options && PGNinput ? load_options.addEventListener("change", (event) => {
        if (Number(load_options.value) == 3) {
            PGNinput.style.visibility = "visible";
        }
        else {
            PGNinput.style.visibility = "hidden";
        }
    }) : console.error("Load options or PGN input listener failed!");
    //load correct grid to board
    load_button && load_options ? load_button.addEventListener("click", (event) => {
        //hande PGN input
        if (Number(load_options.value) == 3) {
            const resultFromString = board_stringToGrid(PGNinput.value);
            if (resultFromString[1][0][0] != -1) {
                console.error(`Wrong string size: ${resultFromString[1][0][0]}!`);
            }
            else {
                load_sudokus[Number(load_options.value)] = resultFromString[0];
            }
        }
        board.grid = cellBoardFromValues(load_sudokus[Number(load_options.value)]);
        board.unsolvedSquares = new Set;
        drawBoard(board, cnv, [window.innerWidth, window.innerHeight], false);
    }) : console.error("Load event listener failed!");
    //get string to copy
    const copy_button = document.getElementById("copy_button");
    const givenSelector = document.getElementById("givenSelector");
    copy_button && givenSelector ? copy_button.addEventListener("click", (event) => {
        const boardString = board_boardToString(board, givenSelector.value == "1");
        copyToClipboard(boardString);
        alert(`Sudoku string copied to clipboard!`);
    }) : console.error("Copy event listener failed!");
    //adjust generator difficulty
    const slider = document.getElementById("difficulty");
    const output = document.getElementById("diffValue");
    slider && output ? output.innerText = slider.value : null;
    slider && output ? slider.addEventListener("input", (event) => {
        output.innerText = slider.value;
    }) : console.error("Difficulty slider listener failed!");
    //generate new sudoku
    const generate_button = document.getElementById("generate_button");
    generate_button ? generate_button.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
        var copyOfPalette = currentPalette;
        const tempGiven = currentPalette.given;
        copyOfPalette.given = "#00BBFF";
        setPalette(copyOfPalette);
        board = yield generateBoard(board.gridSize, Number(slider.value), windowSize, cnv);
        board = yield fixBoardToFitDifficulty(board, Number(slider.value), windowSize, cnv);
        board = board_givenGrid(board);
        copyOfPalette.given = tempGiven;
        setPalette(copyOfPalette);
        yield drawBoard(board, cnv, windowSize);
    })) : console.error("Generate event listener failed!");
    //keyboard
    window.addEventListener("keydown", function (event) {
        var num = Number(event.key);
        if (event.key == "S" || event.key == "s") {
            drawBoard(board, cnv, windowSize);
            return;
        }
        //removal of number
        if (event.key == "Delete" || event.key == "Backspace") {
            num = 0;
        }
        //adding of number
        if (num >= 0 && num <= 9) {
            console.log(num);
            board.selectedCells.forEach((value) => {
                //if number was given, it cannot be changed
                board.grid[Math.floor(value / board.gridSize)][value % board.gridSize].given ? null : board.grid[Math.floor(value / board.gridSize)][value % board.gridSize].num = num;
            });
            if (board.selectedCells.size > 0) {
                drawBoard(board, cnv, windowSize);
            }
        }
    }, true);
}
