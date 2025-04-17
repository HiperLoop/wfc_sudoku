# Sudoku solver

## About the project

I wanted to try and create a solver for sudoku puzzles on my own without looking at how toher people have done it. All of the code is my own. First I started with implementing the basic techniques that I usually use in solving a sudoku. At that point, the solver could solve very basic puzzles but failed at any medium-hard ones. Then I added the capability of using inference chains to eliminate more options. First I added this feature to only look at inference chains arising from cells with only 2 possibilities (as that is the extent I was ever willing to do them), but then I extended this to cover all unsolved cells in the grid. To the best of my knowledge the solver can now solve any sudoku feasibly solvable by a human - it cannot solve some sudokus where random guessing is the best strategy (may be added in the future).

## How the solver works

The solver first uses the basic principles of sudoku solving and when it cannot obtain a solution that way, it uses inference chains.

### Basic solving techniques

#### Naked singles

The first step in the solving process (after calculating the possiblities for all unsolved cells) is to look for naked singles and solve them.

#### Hidden singles

After solving all naked singles, the solver looks for hidden singles in rows, columns and boxes and solves them.

#### Pointing pairs/triples

Then it looks through all the boxes and tries to find any poitning pairs or triples, that it then uses to eliminate possibilities in the corresponding rows or columns.

### Inference chains

If the basic techniques fail to produce a solution, it uses inference chains originating from cells with increasing number of possibilities. From testing it seems that most sudokus can be solved this way.