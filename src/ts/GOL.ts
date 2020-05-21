export class Cell {
  lives: boolean = false;

  constructor(lives: boolean = false) {
    this.lives = lives;
  }
}

export class Field {
  cells: Cell[][];

  constructor(width: number, y: number);
  constructor(cells: Cell[][]);
  constructor(a: any, b?: number) {
    this.cells = ((): Cell[][] => {
      if (a instanceof Array && a.every(v => v instanceof Array && v.every(v => v instanceof Cell))) {
        return a;
      }
      else if (typeof a === 'number' && typeof b === 'number') { 
        return [... Array(b).keys()].map(v => {
          return [... Array(a).keys()].map(v => {
            return new Cell();
          });
        });
      }
      else {
        return [];
      }
    })();
  }
}

export class Const {
  static CELLSIZE: number = 10;
  static CELLSPACE: number = 1;
}