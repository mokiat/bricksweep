package game

import (
	. "github.com/mokiat/bricksweep/levgen/internal/scene"
)

type Direction int

const (
	DirectionUp Direction = iota
	DirectionDown
	DirectionLeft
	DirectionRight
)

type DisplaceSystem interface {
	Move(board *Board, x, y int, direction Direction)
}

func NewDisplaceSystem() DisplaceSystem {
	return &displaceSystem{}
}

type displaceSystem struct {
}

func (s *displaceSystem) Move(board *Board, x, y int, direction Direction) {
	if !board[y][x].Movable() {
		return
	}
	switch direction {
	case DirectionUp:
		s.shiftVertically(board, x, y, -1)
	case DirectionDown:
		s.shiftVertically(board, x, y, 1)
	case DirectionLeft:
		s.shiftHorizontally(board, x, y, -1)
	case DirectionRight:
		s.shiftHorizontally(board, x, y, 1)
	default:
		panic("unknown direction")
	}
}

func (s *displaceSystem) shiftHorizontally(board *Board, x, y, direction int) {
	minX := s.findLastHorizontally(board, x, y, -1)
	maxX := s.findLastHorizontally(board, x, y, 1)
	if direction < 0 {
		for sX := minX; sX < maxX; sX++ {
			board.Swap(sX, y, sX+1, y)
		}
	} else {
		for sX := maxX; sX > minX; sX-- {
			board.Swap(sX, y, sX-1, y)
		}
	}
}

func (s *displaceSystem) shiftVertically(board *Board, x, y, direction int) {
	minY := s.findLastVertically(board, x, y, -1)
	maxY := s.findLastVertically(board, x, y, 1)
	if direction < 0 {
		for sY := minY; sY < maxY; sY++ {
			board.Swap(x, sY, x, sY+1)
		}
	} else {
		for sY := maxY; sY > minY; sY-- {
			board.Swap(x, sY, x, sY-1)
		}
	}
}

func (s *displaceSystem) findLastHorizontally(board *Board, x, y, direction int) int {
	for x+direction >= 0 && x+direction < BoardWidth && board[y][x+direction].Movable() {
		x += direction
	}
	return x
}

func (s *displaceSystem) findLastVertically(board *Board, x, y, direction int) int {
	for y+direction >= 0 && y+direction < BoardHeight && board[y+direction][x].Movable() {
		y += direction
	}
	return y
}

type FuseSystem interface {
	Fuse(board *Board)
}

func NewFuseSystem() FuseSystem {
	return &fuseSystem{}
}

type fuseSystem struct {
	checked       [BoardHeight][BoardWidth]int
	checkedMarker int
}

func (s *fuseSystem) Fuse(board *Board) {
	s.checkedMarker++
	for y := 0; y < BoardHeight; y++ {
		for x := 0; x < BoardWidth; x++ {
			if s.checked[y][x] == s.checkedMarker {
				continue
			}
			brick := board[y][x]
			if !brick.Fusable() {
				continue
			}
			count := s.countFusedBricks(board, x, y, brick)
			if count < brick.FuseCount() {
				continue
			}
			s.fuseBricks(board, x, y, brick)
		}
	}
}

func (s *fuseSystem) countFusedBricks(board *Board, x, y int, brick Brick) int {
	if x < 0 || x >= BoardWidth || y < 0 || y >= BoardHeight {
		return 0
	}
	if s.checked[y][x] == s.checkedMarker || board[y][x] != brick {
		return 0
	}
	s.checked[y][x] = s.checkedMarker
	result := 1
	if x > 0 {
		result += s.countFusedBricks(board, x-1, y, brick)
	}
	if x < BoardWidth-1 {
		result += s.countFusedBricks(board, x+1, y, brick)
	}
	if y > 0 {
		result += s.countFusedBricks(board, x, y-1, brick)
	}
	if y < BoardHeight-1 {
		result += s.countFusedBricks(board, x, y+1, brick)
	}
	return result
}

func (s *fuseSystem) fuseBricks(board *Board, x, y int, brick Brick) int {
	if x < 0 || x >= BoardWidth || y < 0 || y >= BoardHeight {
		return 0
	}
	if board[y][x] != brick {
		return 0
	}
	board[y][x] = BrickBlack
	result := 1
	if x > 0 {
		result += s.fuseBricks(board, x-1, y, brick)
	}
	if x < BoardWidth-1 {
		result += s.fuseBricks(board, x+1, y, brick)
	}
	if y > 0 {
		result += s.fuseBricks(board, x, y-1, brick)
	}
	if y < BoardHeight-1 {
		result += s.fuseBricks(board, x, y+1, brick)
	}
	return result
}
