import Color from "./components/constants/Colors";

export const showElem = (elemName) => {
  document.getElementById(elemName).style.display = "block";
};

export const hideElem = (elemName) => {
  document.getElementById(elemName).style.display = "none";
};

export const enableElem = (elemName) => {
  var elem = document.getElementById(elemName);
  if (elem) {
    elem.disabled = false;
    elem.style.backgroundColor = Color.fore;
    elem.style.cursor = "text";
  }
};

export const disableElem = (elemName) => {
  var elem = document.getElementById(elemName);
  if (elem) {
    elem.disabled = true;
    elem.style.backgroundColor = Color.input;
    elem.style.cursor = "no-drop";
  }
};
