package scene

type Brick uint8

const (
	BrickBlack Brick = iota
	BrickRed
	BrickGreen
	BrickBlue
	BrickYellow
	BrickWhite
)

func (b Brick) Id() string {
	switch b {
	case BrickBlack:
		return "black"
	case BrickRed:
		return "red"
	case BrickGreen:
		return "green"
	case BrickBlue:
		return "blue"
	case BrickYellow:
		return "yellow"
	case BrickWhite:
		return "white"
	default:
		panic("unknown brick")
	}
}

func (b Brick) String() string {
	switch b {
	case BrickBlack:
		return "Black"
	case BrickRed:
		return "Red"
	case BrickGreen:
		return "Green"
	case BrickBlue:
		return "Blue"
	case BrickYellow:
		return "Yellow"
	case BrickWhite:
		return "White"
	default:
		panic("unknown brick")
	}
}

func (b Brick) FuseCount() int {
	switch b {
	case BrickRed:
		return 2
	case BrickGreen:
		return 3
	case BrickBlue:
		return 4
	case BrickYellow:
		return 5
	default:
		return -1
	}
}

func (b Brick) Fusable() bool {
	return b.FuseCount() > 0
}

func (b Brick) Movable() bool {
	return b.Fusable() || (b == BrickWhite)
}
