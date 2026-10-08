export interface BlockProblem {
  message: string
  /** Offsets into the block content the problem should be reported on. */
  start: number
  end: number
}

/** Thrown by build tools when a block does not compile. */
export class TailwindBlockError extends Error {
  readonly problems: BlockProblem[]

  constructor(problems: BlockProblem[]) {
    super(problems.map((problem) => problem.message).join('\n'))
    this.name = 'TailwindBlockError'
    this.problems = problems
  }
}
