import { User } from "./User";

const user = new User('Doe', 'John', 20);

const contentsElem = document.getElementById('contents');

if (!!contentsElem) {
  contentsElem.innerText = `${user.familyName} ${user.givenName}`;
}