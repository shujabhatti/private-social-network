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

export const titleCase = (str) => {
  if (str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }
};
