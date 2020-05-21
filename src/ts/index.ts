import "../assets/stylesheets/style.scss";
import * as PIXI from 'pixi.js';
import * as GOL from './GOL';

const field = new GOL.Field(100, 100);
const app = new PIXI.Application({
  width: Math.max((GOL.Const.CELLSIZE + GOL.Const.CELLSPACE) * Math.max(...field.cells.map(v => v.length)) - GOL.Const.CELLSPACE, 0),
  height: Math.max((GOL.Const.CELLSIZE + GOL.Const.CELLSPACE) * field.cells.length - GOL.Const.CELLSPACE, 0),
  backgroundColor: 0x1099bb,
  view: document.querySelector('#scene') as HTMLCanvasElement
});

field.cells[49][49].lives = true;
const cellImages = field.cells.map((cells, i) => {
  cells.map((cell, j) => {
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = cell.lives ? 0xff0000 : 0xffffff;
    sprite.width = GOL.Const.CELLSIZE;
    sprite.height = GOL.Const.CELLSIZE;
    sprite.x = j * (GOL.Const.CELLSIZE + GOL.Const.CELLSPACE);
    sprite.y = i * (GOL.Const.CELLSIZE + GOL.Const.CELLSPACE);
    app.stage.addChild(sprite);
    return sprite;
  });
});