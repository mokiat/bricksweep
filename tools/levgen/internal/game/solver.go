package game

import (
	"time"

	. "github.com/mokiat/bricksweep/levgen/internal/scene"
)

// A user should not be required to think that much ahead
const MaxDepth = 20

type Solution struct {
	Complete       bool
	Boards         int
	Moves          int
	UniqueBoards   int
	ElapsedSeconds float64
}

type Solver interface {
	Solve(board *Board) Solution
}

type solver struct {
	checked        map[Board]struct{}
	displaceSystem DisplaceSystem
	fuseSystem     FuseSystem
	solution       Solution
	directions     []Direction
	candidates     []candidate
	candidatePush  int
	candidatePop   int
	callback       func()
}

func NewSolver(progressCallback func()) Solver {
	return &solver{
		displaceSystem: NewDisplaceSystem(),
		fuseSystem:     NewFuseSystem(),
		directions: []Direction{
			DirectionUp, DirectionDown, DirectionLeft, DirectionRight,
		},
		candidates:    make([]candidate, 400000),
		candidatePush: 0,
		candidatePop:  0,
		callback:      progressCallback,
	}
}

func (s *solver) Solve(board *Board) Solution {
	s.solution = Solution{
		Complete:     false,
		Boards:       0,
		UniqueBoards: 0,
		Moves:        0,
	}
	if !s.isBoardNormalized(board) {
		return s.solution
	}

	s.checked = make(map[Board]struct{})
	defer func() {
		s.checked = nil
	}()

	s.candidatePush = 0
	s.candidatePop = 0
	s.pushCandidate(candidate{
		Board: board,
		Depth: 0,
	})

	startTime := time.Now()
	s.process()
	s.solution.ElapsedSeconds = time.Now().Sub(startTime).Seconds()

	return s.solution
}

func (s *solver) isBoardNormalized(board *Board) bool {
	copy := board.Clone()
	s.fuseSystem.Fuse(copy)
	return *copy == *board
}

func (s *solver) pushCandidate(candit candidate) {
	s.candidates[s.candidatePush] = candit
	s.candidatePush = (s.candidatePush + 1) % len(s.candidates)
	if s.candidatePush == s.candidatePop {
		panic("queue is full: next push will override a pop")
	}
}

func (s *solver) popCandidate() (candidate, bool) {
	if s.candidatePush == s.candidatePop {
		return candidate{}, false
	}
	result := s.candidates[s.candidatePop]
	s.candidatePop = (s.candidatePop + 1) % len(s.candidates)
	return result, true
}

func (s *solver) process() {
	for candit, ok := s.popCandidate(); ok; candit, ok = s.popCandidate() {
		s.solution.Boards++
		if s.solution.Boards%100 == 0 {
			s.callback()
		}

		if _, ok := s.checked[*candit.Board]; ok {
			continue
		}
		s.checked[*candit.Board] = struct{}{}

		s.solution.UniqueBoards++
		if candit.Board.Complete() {
			s.solution.Complete = true
			s.solution.Moves = candit.Depth
			return
		}
		if candit.Board.IsAtADeadend() {
			continue
		}
		if candit.Depth >= MaxDepth {
			continue
		}
		for y := 0; y < BoardHeight; y++ {
			for x := 0; x < BoardWidth; x++ {
				brick := candit.Board[y][x]
				if !brick.Movable() {
					continue
				}
				for _, dir := range s.directions {
					newBoard := candit.Board.Clone()
					s.displaceSystem.Move(newBoard, x, y, dir)
					s.fuseSystem.Fuse(newBoard)
					s.pushCandidate(candidate{
						Board: newBoard,
						Depth: candit.Depth + 1,
					})
				}
			}
		}
	}
}

type candidate struct {
	Board *Board
	Depth int
}
