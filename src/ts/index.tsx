import "../assets/stylesheets/style.scss";
import React from "react";
import ReactDOM from "react-dom";
import * as PIXI from 'pixi.js';
import * as GOL from './GOL';

const ReactApp = () => {
  return <div className="container">
    <canvas id="scene"></canvas>
  </div>
};

ReactDOM.render(ReactApp(), document.getElementById("app"));

class GOLManager {
  field: GOL.Field
  app: PIXI.Application
  cellImages: PIXI.Sprite[][]
  controlPanel: ControlPanel
  duration: number
  lastUpdateDuration: number

  constructor(canvasSelector: string, width: number, height: number) {
    this.field = new GOL.Field(width, height);
    this.app = new PIXI.Application({
      width: Math.max((GOL.Const.CELLSIZE + GOL.Const.CELLSPACE) * Math.max(...this.field.cells.map(v => v.length)) - GOL.Const.CELLSPACE, 0),
      height: Math.max((GOL.Const.CELLSIZE + GOL.Const.CELLSPACE) * this.field.cells.length - GOL.Const.CELLSPACE, 0),
      backgroundColor: 0xffffff,
      view: document.querySelector(canvasSelector) as HTMLCanvasElement
    });

    this.cellImages = this.field.cells.map((cells, i) => {
      return cells.map((cell, j) => {
        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        sprite.width = GOL.Const.CELLSIZE;
        sprite.height = GOL.Const.CELLSIZE;
        sprite.x = j * (GOL.Const.CELLSIZE + GOL.Const.CELLSPACE);
        sprite.y = i * (GOL.Const.CELLSIZE + GOL.Const.CELLSPACE);
        this.app.stage.addChild(sprite);
        return sprite;
      });
    });
    this.applyFieldToImage();

    this.controlPanel = new ControlPanel(this.field);
    this.app.stage.addChild(this.controlPanel.button);

    this.duration = 0;
    this.lastUpdateDuration = 0;
  }

  start() {
    this.duration = 0;
    this.lastUpdateDuration = 0;
    this.field.randomize();
    this.app.ticker.add(deltaTime => this.animate(deltaTime));
  }

  animate(deltaTime: number) {
      if (typeof deltaTime === 'number') {
        this.duration += deltaTime;
      }

      if (10 < this.duration - this.lastUpdateDuration) {
        this.evolve();
        this.lastUpdateDuration = this.duration;
      }
  }

  evolve() {
    this.field.eveolve();
    this.applyFieldToImage();
  }

  private applyFieldToImage() {
    for(let i = 0; i < this.field.cells.length; i++) {
      for(let j = 0; j < this.field.cells[i].length; j++) {
        const cell = this.field.cells[i][j];
        const image = this.cellImages[i][j];
        if (!cell.lives) {
          image.tint = 0xebedf0;
        }
        else if (cell.environment == 'overPopulation') {
          image.tint = 0x239a3b;
        }
        else if (cell.environment == 'maintainable') {
          image.tint = 0x7bc96f;
        }
        else {
          image.tint = 0xc6e48b;
        }
      }
    }
  }
}

class ControlPanel {
  static width: number = 160

  field: GOL.Field
  button: PIXI.Text

  constructor(field: GOL.Field) {
    this.field = field;

    const button = new PIXI.Text('Restart', {
      fontFamily: ["Helvetica Neue",
        "Arial",
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Meiryo",
        "sans-serif"
      ],
      fontSize: 22, fill: 0x7a7a7a, align: 'center' });
    button.width = ControlPanel.width;
    button.height = 40;
    button.interactive = true;

    button.on('click', this.reset).on('touchstart', this.reset);
    this.button = button;
  }

  public reset = () => {
    this.field.randomize();
  }
}

const manager = new GOLManager('#scene', 69, 7);
manager.start();