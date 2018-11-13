package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"runtime/pprof"
	"time"

	"github.com/mokiat/bricksweep/levgen/internal/game"
	"github.com/mokiat/bricksweep/levgen/internal/scene"
)

var profile = flag.Bool("profile", false, "enable profiling")
var width = flag.Int("width", 2, "board width")
var height = flag.Int("height", 2, "board height")
var black = flag.Int("black", 0, "black brick count")
var red = flag.Int("red", 0, "red brick count")
var green = flag.Int("green", 0, "green brick count")
var blue = flag.Int("blue", 0, "blue brick count")
var yellow = flag.Int("yellow", 0, "yellow brick count")
var white = flag.Int("white", 1, "white brick count")
var minMoves = flag.Int("minMoves", -1, "minimum number of moves")
var maxMoves = flag.Int("maxMoves", -1, "maximum number of moves")
var moves = flag.Int("moves", -1, "exact number of moves")
var minUniqueBoards = flag.Int("minBoards", -1, "minimum number of unique boards explored")
var maxUniqueBoards = flag.Int("maxBoards", -1, "maximum number of unique boards explored")

func main() {
	flag.Parse()

	if *profile {
		file := createProfileFile("levgen.prof")
		pprof.StartCPUProfile(file)
		defer pprof.StopCPUProfile()
	}

	generator := scene.NewBoardGenerator(scene.BoardGeneratorConfig{
		Width:            *width,
		Height:           *height,
		BlackBrickCount:  *black,
		RedBrickCount:    *red,
		GreenBrickCount:  *green,
		BlueBrickCount:   *blue,
		YellowBrickCount: *yellow,
		WhiteBrickCount:  *white,
	})
	solver := game.NewSolver(func() {
		fmt.Print(".")
	})
	fmt.Println("---------------------------------------------------")
	for {
		seed := time.Now().UnixNano()
		board := generator.Generate(seed)
		solution := solver.Solve(board)
		if isSolutionAcceptable(solution) {
			fmt.Println()
			fmt.Println("---------------------------------------------------")
			fmt.Printf("Seed: %d\n", seed)
			fmt.Println()
			printSolution(solution)
			fmt.Println()
			printBoard(board, *width, *height)
			fmt.Println()
			level := scene.NewLevel(*width, *height, board, solution.Moves)
			fmt.Println(string(level.ToJSON()))
			fmt.Println()
			fmt.Println("---------------------------------------------------")
			return
		} else {
			fmt.Print("X")
		}
	}
}

func createProfileFile(name string) *os.File {
	file, err := os.Create(name)
	if err != nil {
		log.Fatal(err)
	}
	return file
}

func isSolutionAcceptable(solution game.Solution) bool {
	if !solution.Complete {
		return false
	}
	if solution.Moves == 0 {
		return false
	}
	if (*moves != -1) && (solution.Moves != *moves) {
		return false
	}
	if (*minMoves != -1) && (solution.Moves < *minMoves) {
		return false
	}
	if (*maxMoves != -1) && (*maxMoves < solution.Moves) {
		return false
	}
	if (*minUniqueBoards != -1) && (solution.UniqueBoards < *minUniqueBoards) {
		return false
	}
	if (*maxUniqueBoards != -1) && (*maxUniqueBoards < solution.UniqueBoards) {
		return false
	}
	return true
}

func printSolution(solution game.Solution) {
	fmt.Println("Solution:")
	fmt.Printf("\tsolution took: %.2fs\n", solution.ElapsedSeconds)
	fmt.Printf("\tnumber of moves: %d\n", solution.Moves)
	fmt.Printf("\tboards explored: %d\n", solution.Boards)
	fmt.Printf("\tunique boards explored: %d\n", solution.UniqueBoards)
}

func printBoard(board *scene.Board, width, height int) {
	fmt.Println("Board:")
	for y := 0; y < height; y++ {
		fmt.Printf("\t|")
		for x := 0; x < width; x++ {
			fmt.Printf("\t %5s |", board[y][x].String())
		}
		fmt.Println()
	}
	fmt.Println()
}
