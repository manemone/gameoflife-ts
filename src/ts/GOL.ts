import './Array+Extensions';

export class Cell {
  lives: boolean = false;

  /**
   * Initialize the cell with given living / dead state
   * @param lives Is this cell is living or dead
   */
  constructor(lives: boolean = false) {
    this.lives = lives;
  }
}

const cellStates = ['overPopulation', 'underPopulation', 'reproduction', 'maintainable'] as const;
type CellEnvironment = typeof cellStates[number];

/**
 * Represents a field for the game of life.
 * It keeps the cells as two dimensional array.
 */
export class Field {
  cells: Cell[][];
  nextGenerationCells: Cell[][];

  /**
   * Initialize field with given size.
   * @param width Field width
   * @param height Field height
   */
  constructor(width: number, height: number);

  /**
   * Initialize field with given cells
   * @param cells Cell array to set the generated field
   */
  constructor(cells: Cell[][]);

  constructor(a: any, b?: number) {
    this.cells = this.generateCellArrays(a, b);
    this.nextGenerationCells = this.generateCellArrays(a, b);
  }

  private generateCellArrays(a: any, b?: number): Cell[][] {
    if (a instanceof Array && a.every(v => v instanceof Array && v.every(v => v instanceof Cell))) {
      return a;
    }
    else if (typeof a === 'number' && typeof b === 'number') {
      return [...Array(b).keys()].map(v => {
        return [...Array(a).keys()].map(v => {
          return new Cell();
        });
      });
    }
    else {
      return [];
    }
  }

  /**
   * Set randomized live / dead state to every cells in the field.
   */
  randomize() {
    this.cells.forEach((rows, i) => {
      rows.forEach((cell, j) => {
        this.cells[i][j].lives = Math.floor(Math.random() * 11) % 2 == 0;
      });
    });
  }

  /**
   * Evaluate the environment of all cells and update the field generation.
   */
  eveolve() {
    for(let i = 0; i < this.cells.length; i++) {
      for(let j = 0; j < this.cells[i].length; j++) {
        // Determine the environment of the cell and update the live / dead state
        this.nextGenerationCells[i][j].lives = ['maintainable', 'reproduction'].includes(this.cellEnvironmentAt(i, j));
      }
    }

    // Swap the old / new generation and keep the older one as the evalutation buffer
    // to avoid unexpected GCs.
    const oldCells = this.cells;
    this.cells = this.nextGenerationCells;
    this.nextGenerationCells = oldCells;
  }

  /**
   * Returns the current field map as a text block
   */
  description(): string {
    return this.cells.map(row => {
      return row.map(cell => cell.lives ? "1" : " ").join("");
    }).join("\n");
  }

  /**
   * Returns the environment the specified cell in.
   * @param rI Horizontal index of the target cell
   * @param cI Vertical index of the target cell
   */
  private cellEnvironmentAt(rI: number, cI: number): CellEnvironment {
    const cell = this.cells[rI][cI];

    // Number of the living cell around the specified cell
    let liveCellNumber: number = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) { continue; }
        if (this.cells.circularAt(rI + i)?.circularAt(cI - j)?.lives || false) { liveCellNumber++; }
      }
    }

    if (cell.lives) {
      if (liveCellNumber <= 1) {
        // Too lonely to live
        return 'underPopulation';
      }
      else if (liveCellNumber <= 3) {
        // Comfortable
        return 'maintainable';
      }
      else {
        // Too crowded to live
        return 'overPopulation';
      }
    }
    else {
      if (liveCellNumber == 3) {
        // Here comes a new baby!
        return 'reproduction';
      }
      else {
        // Still difficult place to live
        return 'underPopulation';
      }
    }
  }
}

export class Const {
  static CELLSIZE: number = 8;
  static CELLSPACE: number = 1;
}