import { User } from "./User";
import "../assets/stylesheets/style.scss";

const user = new User('Doe', 'John', 20);

const contentsElem = document.getElementById('contents');

if (!!contentsElem) {
  contentsElem.innerText = `${user.familyName} ${user.givenName}`;

  const imgElem = document.createElement('img');
  const img = require('../assets/images/campbel_can.jpg');
  imgElem.src = img.default;
  contentsElem.appendChild(imgElem);
}