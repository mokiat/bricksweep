package scene

const BoardWidth = 8
const BoardHeight = 8

type Board [BoardHeight][BoardWidth]Brick

func NewBoard() *Board {
	result := new(Board)
	for y := 0; y < BoardHeight; y++ {
		for x := 0; x < BoardWidth; x++ {
			result[y][x] = BrickBlack
		}
	}
	return result
}

func (b *Board) Clone() *Board {
	newBoard := new(Board)
	*newBoard = *b
	return newBoard
}

func (b *Board) Swap(x1, y1, x2, y2 int) {
	b[y1][x1], b[y2][x2] = b[y2][x2], b[y1][x1]
}

func (b *Board) Complete() bool {
	for y := 0; y < BoardHeight; y++ {
		for x := 0; x < BoardWidth; x++ {
			if b[y][x].Fusable() {
				return false
			}
		}
	}
	return true
}

func (b *Board) BrickOccurance(brick Brick) int {
	result := 0
	for y := 0; y < BoardHeight; y++ {
		for x := 0; x < BoardWidth; x++ {
			if b[y][x] == brick {
				result++
			}
		}
	}
	return result
}

func (b *Board) IsAtADeadend() bool {
	return !b.hasEnoughBricksOccurance(BrickRed) ||
		!b.hasEnoughBricksOccurance(BrickGreen) ||
		!b.hasEnoughBricksOccurance(BrickBlue) ||
		!b.hasEnoughBricksOccurance(BrickYellow)
}

func (b *Board) hasEnoughBricksOccurance(brick Brick) bool {
	count := b.BrickOccurance(brick)
	return (count == 0) || (count >= brick.FuseCount())
}
