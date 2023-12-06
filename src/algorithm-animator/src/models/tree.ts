export interface Tree {
    c1?: Tree
    c2?: Tree
    p?: Tree
    value?: string
    nullable?: boolean
    firstpos?: Set<number>
    lastpos?: Set<number>
    followpos?: Set<number>
}

export interface ParseResult {
    success : boolean
    parsed: string
    remainder: string
}