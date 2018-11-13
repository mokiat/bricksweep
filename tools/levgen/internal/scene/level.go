package scene

import (
	"encoding/json"
	"log"
)

type Level struct {
	Width       int      `json:"width"`
	Height      int      `json:"height"`
	Bricks      []string `json:"bricks"`
	GoldMoves   int      `json:"gold_moves"`
	SilverMoves int      `json:"silver_moves"`
}

func NewLevel(width, height int, board *Board, moves int) *Level {
	level := Level{
		Width:       width,
		Height:      height,
		Bricks:      []string{},
		GoldMoves:   moves,
		SilverMoves: moves + 1,
	}
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			level.Bricks = append(level.Bricks, board[y][x].Id())
		}
	}
	return &level
}

func (l *Level) ToJSON() []byte {
	json, err := json.MarshalIndent(l, "", "  ")
	if err != nil {
		log.Fatal(err)
	}
	return json
}
