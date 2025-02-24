interface Node {
  key: string | number
  text: string
  category: string
  loc: string
}

interface Link {
  from: string | number
  to: string | number
  points: Array<number>
}

export type {Node, Link}