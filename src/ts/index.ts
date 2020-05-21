import "../assets/stylesheets/style.scss";
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: 720,
  height: 720,
  backgroundColor: 0x1099bb,
  view: document.querySelector('#scene') as HTMLCanvasElement
});

const texture = PIXI.Texture.from(require('../assets/images/campbel_can.jpg').default);
const image = new PIXI.Sprite(texture);
image.anchor.set(0.5);
image.x = 360;
image.y = 360;
image.scale.set(0.5, 0.5);
app.stage.addChild(image);

app.ticker.add((delta) => {
  image.rotation -= 0.01 * delta;
});