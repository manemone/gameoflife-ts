import './Array+Extensions';

export class Cell {
  lives: boolean;
  environment: CellEnvironment

  /**
   * Initialize the cell with given living / dead state
   * @param lives Is this cell is living or dead?
   * @param environment Surrounding cell's state
   */
  constructor(lives: boolean = false, environment: CellEnvironment = 'underPopulation') {
    this.lives = lives;
    this.environment = environment;
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
    Field.setCellEnvironmentOf(this.cells);
    this.nextGenerationCells = this.generateCellArrays(a, b);
    Field.setCellEnvironmentOf(this.nextGenerationCells);
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
    for(let i = 0; i < this.cells.length; i++) {
      for(let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].lives = Math.floor(Math.random() * 11) % 2 == 0;
      }
    }
    Field.setCellEnvironmentOf(this.cells);
  }

  /**
   * Evaluate the environment of all cells and update the field generation.
   */
  eveolve() {
    for(let i = 0; i < this.cells.length; i++) {
      for(let j = 0; j < this.cells[i].length; j++) {
        this.nextGenerationCells[i][j].lives = ['maintainable', 'reproduction'].includes(this.cells[i][j].environment);
      }
    }
    for(let i = 0; i < this.cells.length; i++) {
      for(let j = 0; j < this.cells[i].length; j++) {
        this.nextGenerationCells[i][j].environment = Field.cellEnvironmentAt(this.nextGenerationCells, i, j);
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

  private static setCellEnvironmentOf(cells: Cell[][]) {
    for(let i = 0; i < cells.length; i++) {
      for(let j = 0; j < cells[i].length; j++) {
        cells[i][j].environment = Field.cellEnvironmentAt(cells, i, j);
      }
    }
  }

  /**
   * Returns the environment the specified cell in.
   * @param cells Target cell array
   * @param rI Horizontal index of the target cell
   * @param cI Vertical index of the target cell
   */
  private static cellEnvironmentAt(cells: Cell[][], rI: number, cI: number): CellEnvironment {
    const cell = cells[rI][cI];

    // Number of the living cell around the specified cell
    let liveCellNumber: number = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) { continue; }
        if (cells.circularAt(rI + i)?.circularAt(cI - j)?.lives || false) { liveCellNumber++; }
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
  static CELLSIZE: number = 10;
  static CELLSPACE: number = 3;
}