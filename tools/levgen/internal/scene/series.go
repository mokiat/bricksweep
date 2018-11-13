package scene

import "math/rand"

type BrickSeries interface {
	Push(brick Brick, count int)
	Pop() Brick
	Shuffle()
}

func NewBrickSeries() BrickSeries {
	return &series{
		bricks: []Brick{},
		index:  0,
	}
}

type series struct {
	bricks []Brick
	index  int
}

func (s *series) Push(brick Brick, count int) {
	for i := 0; i < count; i++ {
		s.bricks = append(s.bricks, brick)
	}
}

func (s *series) Pop() Brick {
	result := s.bricks[s.index]
	s.index = (s.index + 1) % len(s.bricks)
	return result
}

func (s *series) Shuffle() {
	for i := range s.bricks {
		j := rand.Intn(len(s.bricks))
		s.bricks[i], s.bricks[j] = s.bricks[j], s.bricks[i]
	}
}
