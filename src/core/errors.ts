/** Why a block does not compile, and which part of it to point at. */
export interface BlockProblem {
  /** The yaml parser's message, or which key holds an invalid value. */
  message: string
  /** Offset into the block content where the problem starts. 0 when it covers the whole block. */
  start: number
  /** Offset into the block content where the problem ends, exclusive. */
  end: number
}

/** Thrown when a block does not compile, by the Vite plugin and by `compileBlockOrThrow`. */
export class TailwindBlockError extends Error {
  /** Every problem found in the block. The error message joins their messages, one per line. */
  readonly problems: BlockProblem[]

  constructor(problems: BlockProblem[]) {
    super(problems.map((problem) => problem.message).join('\n'))
    this.name = 'TailwindBlockError'
    this.problems = problems
  }
}
