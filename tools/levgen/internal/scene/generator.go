package scene

import "math/rand"

type BoardGenerator interface {
	Generate(seed int64) *Board
}

type BoardGeneratorConfig struct {
	Width            int
	Height           int
	BlackBrickCount  int
	RedBrickCount    int
	GreenBrickCount  int
	BlueBrickCount   int
	YellowBrickCount int
	WhiteBrickCount  int
}

func NewBoardGenerator(config BoardGeneratorConfig) BoardGenerator {
	return &generator{
		config: config,
	}
}

type generator struct {
	config BoardGeneratorConfig
}

func (g *generator) Generate(seed int64) *Board {
	rand.Seed(seed)
	series := NewBrickSeries()
	series.Push(BrickBlack, g.config.BlackBrickCount)
	series.Push(BrickRed, g.config.RedBrickCount)
	series.Push(BrickGreen, g.config.GreenBrickCount)
	series.Push(BrickBlue, g.config.BlueBrickCount)
	series.Push(BrickYellow, g.config.YellowBrickCount)
	series.Push(BrickWhite, g.config.WhiteBrickCount)
	series.Shuffle()
	board := NewBoard()
	for y := 0; y < g.config.Height; y++ {
		for x := 0; x < g.config.Width; x++ {
			board[y][x] = series.Pop()
		}
	}
	return board
}
