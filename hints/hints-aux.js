/*
  Auxiliary hint functions for hint generator of JS-help

  Juliet Slade - Web Programming Independent Study - Spring 2017
*/

//Each line of the code's body is represented as an object
function makeObj(text, curly, range, nestedUnder, depth, body) {
  var obj = {};
  obj.text = text;
  if (curly && curly.type === "close") {
    obj.expandedFully = true;
  } else {
    obj.expandedFully = false;
  }
  if (body === undefined) {
    obj.parsed = false;
  } else {
    obj.parsed = body;
  }
  obj.curly = curly;
  obj.range = range;
  if (curly && curly.type === "close") {
    obj.displayCode = obj.text;
  } else {
    obj.displayCode = "//...\n";
  }
  obj.hintLevel = 0;
  obj.displayedYet = false;
  obj.nestedUnder = nestedUnder;
  obj.depth = depth;
  return obj;
}

/* Functions that return positions */

function getElsePos(txt, start) {
  var pos = getClosingPos(txt, start, []);
  if (txt[pos] === "} else {") {
    return pos;
  } else {
    return "error: didn't work";
  }
}

function getClosingPos(txt, i, brackets) {
  if (txt[i].indexOf('}') !== -1) {
    var o = brackets.pop();
    if (o === "{") {
      if (brackets.length === 0) {
        return i;
      } else {
        if (txt[i].indexOf('{') !== -1) {
          brackets.push('{');
        }
        return getClosingPos(txt, i+1, brackets);
      }
    } else {
      return "error, mismatched brackets";
    }
  } else if (txt[i].indexOf('{') !== -1) {
    brackets.push('{');
    return getClosingPos(txt, i+1, brackets);
  } else {
    return getClosingPos(txt, i+1, brackets);
  }
}
