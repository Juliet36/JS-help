/*
<<<<<<< HEAD
hints-mid.js
hint generator for NAME
DESCRIPTION
FAULTS

Juliet Slade - Web Programming Independent Study - Spring 2017
*/

const G1 = {
=======
  hint generator for JS-help
  methods to:
    -take in AST and generate collapsed hint object with pointers to solution lines
    -expand hints when given a row
    -generate string version of a line at various depths of hints

  TODO:
    -add support for single ifs (no else), else ifs
    -generalize case of empty quotes or quoted character in generating string version of hint
    -change variables that display to be of _x format rather than /* *'/
    -save generated hint code ?

  Juliet Slade - Web Programming Independent Study - Spring 2017
*/

const HINT_G = {
>>>>>>> master
            body: [],
            currentState: [],
            currentDepth: 0
          };

function reset() {
<<<<<<< HEAD
  G1.body = [];
  G1.currentState = [];
  G1.currentDepth = 0;
=======
  HINT_G.body = []; //maps uuids/names => lines of code
  HINT_G.currentState = []; //current state of the hint ACE editor
  HINT_G.currentDepth = 0;
}

//Takes in JS AST and sets up the hint version
function setUpAll(parsedCode, edit) {
  for (var i = 0; i < parsedCode.body.length; i++) {
    if (parsedCode.body[i].type === esprima.Syntax.FunctionDeclaration) {
      textArray = edit.session.getLines(parsedCode.body[i].loc.start.line, parsedCode.body[i].loc.end.line-2);
      var extras = {params: parsedCode.body[i].params, name: parsedCode.body[i].id.name, range: parsedCode.body[i].body.loc};
      setUp(parsedCode.body[i].body.body, textArray, "function", extras);
    } else if (parsedCode.body[i].type === esprima.Syntax.ExpressionStatement &&
    parsedCode.body[i].expression.type === esprima.Syntax.CallExpression) {
      textArray = [edit.session.getLine(parsedCode.body[i].loc.start.line-1)];
      var extras = {args: parsedCode.body[i].expression.arguments , name: parsedCode.body[i].expression.callee.name, range: parsedCode.body[i].loc};//TODO: range? necessary or even right?
      setUp(parsedCode.body[i].expression, textArray, "call", extras);
    } else {
      //it's neither a function nor call
      //will need to get start and end of this random body
      //right now, assume it's all text in editor
    }
  }
  edit.setValue(displayState());
>>>>>>> master
}

//takes in an esprima parsed object
//and an array of all lines of code
function setUp(parsedCode, textCode, type, extras) {
  var solutionTree;
  var solutionText;
  var solutionLines;
  var obj = {};
  var bodyObj;
  var uuid = guid();
  if (type === "function") {
    obj.params = extras.params;
    obj.name = extras.name;
    obj.type = type;
<<<<<<< HEAD
    G1.currentState.push({name: extras.name, functionSkellie: "start", type: "function", uuid: uuid});
=======
    HINT_G.currentState.push({name: extras.name, functionSkellie: "start", type: "function", uuid: uuid});
>>>>>>> master
  } else if (type === "call") {
    obj.name = extras.name;
    obj.args = extras.args;
    obj.type = type;
  } else {
    console.log("OTHER SITUATION?");
  }
  obj.uuid = uuid;
  obj.solutionTree = parsedCode;
  obj.solutionText = textCode;
  textCode = textCode.map(x => x.trim());
  if (type === "call") {
    bodyObj = makeObj(textCode, false, extras.range, -1, 0, parsedCode);
  } else {
    bodyObj = makeBodyLs([], textCode, parsedCode, 0, 0, -1, 0);
  }
  obj.solutionLines = bodyObj;
<<<<<<< HEAD
  G1.body.push(obj);
  G1.currentState.push({foldedBody:true, bodyLines:-1, display:true, type: type, name: extras.name, uuid: uuid, range: extras.range});
  if (type === "function") {
    G1.currentState.push({name: extras.name, functionSkellie: "end", type: "function", uuid: uuid});
  }
}

=======
  HINT_G.body.push(obj);
  HINT_G.currentState.push({foldedBody:true, bodyLines:-1, display:true, type: type, name: extras.name, uuid: uuid, range: extras.range});
  if (type === "function") {
    HINT_G.currentState.push({name: extras.name, functionSkellie: "end", type: "function", uuid: uuid});
  }
}

//formats the current state of the hint ACE editor
>>>>>>> master
function displayState() {
  var state;
  var body;
  var overallBody;
  var inFunction;
  var displayText = "";
<<<<<<< HEAD
  for (var i = 0; i < G1.currentState.length; i++) {
    for (var j = 0; j < G1.body.length; j++) {
      if (G1.body[j].uuid === G1.currentState[i].uuid) {
        body = G1.body[j].solutionLines;
        overallBody = G1.body[j];
        break;
      }
    }
    if (G1.currentState[i].functionSkellie==="start") {
      //function start
      displayText += "function " + overallBody.name + "(" + overallBody.params.map(x => x.name) + ") {\n";
      inFunction = true;
    } else if (G1.currentState[i].functionSkellie=== "end") {
      //function end
      inFunction = false;
      displayText += "}\n";
    } else if (G1.currentState[i].type === "call") {
      displayText += overallBody.solutionText;
    } else {
      state = G1.currentState[i];
=======
  for (var i = 0; i < HINT_G.currentState.length; i++) {
    for (var j = 0; j < HINT_G.body.length; j++) {
      if (HINT_G.body[j].uuid === HINT_G.currentState[i].uuid) {
        body = HINT_G.body[j].solutionLines;
        overallBody = HINT_G.body[j];
        break;
      }
    }
    if (HINT_G.currentState[i].functionSkellie==="start") {
      //function start
      displayText += "function " + overallBody.name + "(" + overallBody.params.map(x => x.name) + ") {\n";
      inFunction = true;
    } else if (HINT_G.currentState[i].functionSkellie=== "end") {
      //function end
      inFunction = false;
      displayText += "}\n";
    } else if (HINT_G.currentState[i].type === "call") {
      displayText += overallBody.solutionText;
    } else {
      state = HINT_G.currentState[i];
>>>>>>> master
      if (state.foldedBody) {
        //get the indentation somehow
        if (inFunction) {
          displayText += "    ";
        }
        displayText += "/*...*/\n";
      } else {
        if (state.display) {
          if (inFunction) {
            displayText += "    ";
          }
          displayText += "    ".repeat(body[state.bodyLines].depth) + body[state.bodyLines].displayCode;
        }
        body[state.bodyLines].displayedYet = true; //TODO:right?
      }
    }
  }
  return displayText;
}

<<<<<<< HEAD
function getName(row) {
  for (var i = 0; i < G1.currentState.length; i++) {
    if (row < G1.currentState[i].range.end.line && row > G1.currentState[i].range.start.line) {
      return G1.currentState[i].name;
    }
  }
  return "unknown funName";
}


function hint(row) {
  var rowObj = G1.currentState[row];
=======
/* Hint Expansion */

function hint(row) {
  var rowObj = HINT_G.currentState[row];
>>>>>>> master
  if (!rowObj.functionSkellie && rowObj.type !== "call") {
    if (rowObj.foldedBody) {
      GLOBAL.hintsUsed++;
      expandBody(rowObj.bodyLines, row, rowObj.uuid, rowObj.name);
    } else {
      //expand in another way, on a line by line basis
      if (rowObj.bodyLines.expandedFully) {
        //do nothing
      } else {
        GLOBAL.hintsUsed++;
        expandLine(rowObj.bodyLines, row, rowObj.uuid, rowObj.name);
      }
    }
  }
  return displayState();
}

function expandLine(bodyLine, row, uuid, name) {
  var solutionLines;
<<<<<<< HEAD
  for (var j = 0; j < G1.body.length; j++) {
    if (G1.body[j].uuid === uuid) {
      solutionLines = G1.body[j].solutionLines;
=======
  for (var j = 0; j < HINT_G.body.length; j++) {
    if (HINT_G.body[j].uuid === uuid) {
      solutionLines = HINT_G.body[j].solutionLines;
>>>>>>> master
    }
  }
  if (!solutionLines[bodyLine].parsed) {
    solutionLines[bodyLine].displayCode = solutionLines[bodyLine].text + "\n";
  } else {
<<<<<<< HEAD
    G1.currentDepth = 0;
=======
    HINT_G.currentDepth = 0;
>>>>>>> master
    solutionLines[bodyLine].displayCode = expandHint(solutionLines[bodyLine].parsed, solutionLines[bodyLine].hintLevel) + "\n";
    solutionLines[bodyLine].hintLevel++;
  }
  solutionLines[bodyLine].expandedFully = true;
  if (solutionLines[bodyLine].curly && !solutionLines[bodyLine].curly.expanded) {
    var keepGoing = true;
    solutionLines[bodyLine].curly.expanded = true;
    while (keepGoing) {
      var nextCurlyPos = solutionLines.filter(x => x.curly.closes === bodyLine);
      if (nextCurlyPos.length === 0) {
        keepGoing = false;
      } else {
        var cPos = solutionLines.indexOf(nextCurlyPos[0]); //position of curly that closes the first one
<<<<<<< HEAD
        G1.currentState.splice(row+1, 0, {foldedBody:true, bodyLines:nextCurlyPos[0].curly.closes, display:true, name: name, uuid:uuid});//display?
        G1.currentState.splice(row+2, 0, {foldedBody:false, bodyLines:cPos, display:true, name: name, uuid:uuid});//display? this is adding the closing brace, don't do until you're done?
        nextCurlyPos.expandedFully = true;
        solutionLines[nextCurlyPos[0].curly.closes].curly.expanded = true;
        solutionLines[cPos].curly.expanded = true;
        solutionLines[cPos].displayCode = solutionLines[cPos].text + "\n"; //this may mean nothing?? TODO: ad new lines
=======
        HINT_G.currentState.splice(row+1, 0, {foldedBody:true, bodyLines:nextCurlyPos[0].curly.closes, display:true, name: name, uuid:uuid});//display?
        HINT_G.currentState.splice(row+2, 0, {foldedBody:false, bodyLines:cPos, display:true, name: name, uuid:uuid});//display? this is adding the closing brace, don't do until you're done?
        nextCurlyPos.expandedFully = true;
        solutionLines[nextCurlyPos[0].curly.closes].curly.expanded = true;
        solutionLines[cPos].curly.expanded = true;
        solutionLines[cPos].displayCode = solutionLines[cPos].text + "\n"; //this may mean nothing?? TODO: add new lines
>>>>>>> master
        bodyLine = cPos;
        row = row + 2; //TODO:why? what is this for
      }
    }
  }
}

function expandBody(nestedUnder, row, uuid, name) {
  //replace body with the appropriate number of lines, commented
  var expandArr = [];
  var solutionLines;
<<<<<<< HEAD
  for (var j = 0; j < G1.body.length; j++) {
    if (G1.body[j].uuid === uuid) {
      solutionLines = G1.body[j].solutionLines;
=======
  for (var j = 0; j < HINT_G.body.length; j++) {
    if (HINT_G.body[j].uuid === uuid) {
      solutionLines = HINT_G.body[j].solutionLines;
>>>>>>> master
    }
  }
  for (var i = 0; i < solutionLines.length; i++) {
    if (solutionLines[i].nestedUnder === nestedUnder) {
      if (solutionLines[i].curly && solutionLines[i].curly.type === "close") {
        //it's a curly
        //don't change the display code but also don't display it
        //ignore it
      } else {
        solutionLines[i].displayCode = '//...\n';
        expandArr.push({foldedBody:false, bodyLines: i, display:true, name: name, uuid: uuid});
      }
    }
  }
<<<<<<< HEAD
  G1.currentState = G1.currentState.slice(0, row).concat(expandArr).concat(G1.currentState.slice(row+1, G1.currentState.length));
=======
  HINT_G.currentState = HINT_G.currentState.slice(0, row).concat(expandArr).concat(HINT_G.currentState.slice(row+1, HINT_G.currentState.length));
>>>>>>> master
}

//keep track of an object that has detail for every line
// expandedFully: Boolean
<<<<<<< HEAD
=======
// parsed: Boolean
// curly: String
>>>>>>> master
// code: String
// range: Range
// displayCode: String
// hintLevel: Integer
// displayedYet: Boolean
<<<<<<< HEAD
=======
// nestedUnder: Integer
// depth: Integer
>>>>>>> master

function makeBodyLs(ls, txt, bd, i, j, nestedUnder, depth) {
  if (bd.length-1 === i && bd[i].type !== esprima.Syntax.WhileStatement && bd[i].type !== esprima.Syntax.IfStatement) { //&& bd[i].type !== esprima.Syntax.WhileStatement && bd[i].type !== esprima.Syntax.IfStatement) { //&& (j >= txt.length-1 || nestedUnder !== 0)) { TODO
    if (txt[j] !== "}" && txt[j] !== "} else {") {
      var o = makeObj(txt[j], false, bd[i].loc, nestedUnder, depth, bd[i]);
      ls.push(o);
      return ls;
    } else {
      return makeBodyLs(ls, txt, bd, i, j+1, nestedUnder, depth);
    }
  } else if (bd[i].type === esprima.Syntax.WhileStatement) {
    var o = makeObj(txt[j], {type: "open", expanded:false}, bd[i].test.loc, nestedUnder, depth, bd[i]); //openCurly
    ls.push(o);
    oj = getClosingPos(txt, j, [])
    j++;
<<<<<<< HEAD
    var J = j-1;
    var nest = makeBodyLs(ls, txt, bd[i].body.body, 0, j, j-1, depth + 1);
    var o = makeObj('}', {type: "close", closes: J, connectedTo: [J], expanded:false}, {"start":{"row":oj,"column":0},"end":{"row":oj,"column":1}}, nestedUnder, depth); //closing curly
=======
    var prevJ = j-1;
    var nest = makeBodyLs(ls, txt, bd[i].body.body, 0, j, j-1, depth + 1);
    var o = makeObj('}', {type: "close", closes: J, connectedTo: [prevJ], expanded:false}, {"start":{"row":oj,"column":0},"end":{"row":oj,"column":1}}, nestedUnder, depth); //closing curly
>>>>>>> master
    nest = nest.concat([o]);
    if (bd.length-1 === i) {
      return nest;
    } else {
      var full = makeBodyLs([], txt, bd, i+1, oj, nestedUnder, depth);
      return nest.concat(full);
    }
  } else if (bd[i].type === esprima.Syntax.IfStatement) {
    var o = makeObj(txt[j], {type: "open", expanded:false}, bd[i].test.loc, nestedUnder, depth, bd[i]); //openCurly
    ls.push(o);
    var elseLineNum = getElsePos(txt, j);
    j++;
<<<<<<< HEAD
    var JJ = j-1;
=======
    var previousJ = j-1;
>>>>>>> master
    var nest1 = makeBodyLs(ls, txt, bd[i].consequent.body, 0, j, j-1, depth+1);
    var pos = j;
    while (txt[pos] !== "} else {") {
      pos++;
    }
    j = pos;
<<<<<<< HEAD
    var el = makeObj('} else {', {type: "close", closes: JJ, connectedTo: [JJ], expanded:false}, {"start":{"row":j,"column":0},"end":{"row":j,"column":7}}, nestedUnder, depth); //closing curly mid
    var oj = getClosingPos(txt, j+1, ['{']);
    var nest2 = makeBodyLs([el], txt, bd[i].alternate.body, 0, j+1, elseLineNum, depth+1);
    var o = makeObj('}', {type: "close", closes: elseLineNum, connectedTo: [JJ, elseLineNum], expanded:false}, {"start":{"row":oj,"column":0},"end":{"row":oj,"column":1}}, nestedUnder, depth); //closing curly
=======
    var el = makeObj('} else {', {type: "close", closes: previousJ, connectedTo: [previousJ], expanded:false}, {"start":{"row":j,"column":0},"end":{"row":j,"column":7}}, nestedUnder, depth); //closing curly mid
    var oj = getClosingPos(txt, j+1, ['{']);
    var nest2 = makeBodyLs([el], txt, bd[i].alternate.body, 0, j+1, elseLineNum, depth+1);
    var o = makeObj('}', {type: "close", closes: elseLineNum, connectedTo: [previousJ, elseLineNum], expanded:false}, {"start":{"row":oj,"column":0},"end":{"row":oj,"column":1}}, nestedUnder, depth); //closing curly
>>>>>>> master
    nest2 = nest2.concat([o]);
    var nest = nest1.concat(nest2);
    if (bd.length - 1 === i) {
      return nest;
    } else {
      var full = makeBodyLs([], txt, bd, i+1, oj, nestedUnder, depth);
      return nest.concat(full);
    }
  } else {
    if (txt[j] !== "}") {
      var o = makeObj(txt[j], false, bd[i].loc, nestedUnder, depth, bd[i]);
      ls.push(o);
      j++;
    } else {
      return makeBodyLs(ls, txt, bd, i, j+1, nestedUnder, depth);
    }
    return makeBodyLs(ls, txt, bd, i+1, j, nestedUnder, depth);
  }
}

<<<<<<< HEAD
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


=======
//Generates the string version of the hint on a line at the current level
>>>>>>> master
function expandHint(ln, maxDepth) {
  switch (ln.type) {
    case esprima.Syntax.Literal:
      var val = ln.value;
      if (val === "") {
        val = '""';
      }
      if (val === '*') {//TODO: generalize this phenomenon
        val = '"*"';
      }
      return val;
    case esprima.Syntax.UnaryExpression:
      var op = ln.operator;
      var arg = ln.argument;
      break;
    case esprima.Syntax.UpdateExpression:
      var op = ln.operator;
      var arg = ln.argument;
      break;
    case esprima.Syntax.Identifier:
      var id = ln.name;
      return id;
    case esprima.Syntax.ExpressionStatement:
      var exp = ln.expression;
      return expandHint(exp, maxDepth);
    case esprima.Syntax.VariableDeclaration:
      var id = ln.declarations[0].id;
      var val = ln.declarations[0].init;
      var s = ["var", "/* */", "=", "/* */", ";"];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[1] = expandHint(id, maxDepth);
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[1] = expandHint(id, maxDepth);
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[3] = expandHint(val, maxDepth);
      }
      return s.join(' ');
    case esprima.Syntax.LogicalExpression:
      var op = ln.operator;
      var l = ln.left;
      var r = ln.right;
      var s = ["/* */", '/* */', '/* */'];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[1] = ln.operator;
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[0] = expandHint(l, maxDepth);
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[1] = ln.operator;
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[0] = expandHint(l, maxDepth);
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[2] = expandHint(r, maxDepth);
      }
      return s.join(' ');
    case esprima.Syntax.BinaryExpression:
      var op = ln.operator;
      var l = ln.left;
      var r = ln.right;
      var s = ["/* */", '/* */', '/* */'];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[1] = ln.operator;
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[0] = expandHint(l, maxDepth);
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[1] = ln.operator;
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[0] = expandHint(l, maxDepth);
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[2] = expandHint(r, maxDepth);
      }
      return s.join(' ');
    case esprima.Syntax.AssignmentExpression:
      var op = ln.operator;
      var l = ln.left;
      var r = ln.right;
      var s = ["/* */", '/* */', '/* */', ";"];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[1] = ln.operator;
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[0] = expandHint(l, maxDepth);
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[1] = ln.operator;
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[0] = expandHint(l, maxDepth);
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[2] = expandHint(r, maxDepth);
      }
      return s.join(' ');
  //  case esprima.Syntax.FunctionDeclaration:
    case esprima.Syntax.CallExpression:
      var callee = ln.callee;
      var args = ln.arguments;
      var s = ["/* */" , "(" , "/* */" , ")"];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
        s[0] = expandHint(callee,maxDepth);
      }
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
        s[0] = expandHint(callee,maxDepth);
      }
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[2] = args.map(x=>expandHint(x, maxDepth)).join(','); //TODO:expand to number of arguments then expand those
      }
      return s.join('');
    case esprima.Syntax.IfStatement:
      var test = ln.test;
      var s = ["if", "(", "/* */", ")", "{"];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[2] = expandHint(test,maxDepth);
      }
      return s.join(' ');
    case esprima.Syntax.WhileStatement:
      var test = ln.test;
      var s = ["while", "(", "/* */", ")", "{"];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[2] = expandHint(test,maxDepth);
      }
      return s.join(' ');
    case esprima.Syntax.ReturnStatement:
      var arg = ln.argument;
      var s = ['return', '/* */', ';'];
<<<<<<< HEAD
      if (G1.currentDepth <= maxDepth-1) {
        G1.currentDepth++;
=======
      if (HINT_G.currentDepth <= maxDepth-1) {
        HINT_G.currentDepth++;
>>>>>>> master
        s[1] = expandHint(arg,maxDepth);
      }
      return s.join(' ');
    case esprima.Syntax.MemberExpression:
      if (ln.computed) {
        var obj = ln.object;
        var prop = ln.property;
        var s = ['/* */', '[', '/* */', ']'];
<<<<<<< HEAD
        if (G1.currentDepth <= maxDepth-1) {
          G1.currentDepth++;
          s[0] = expandHint(obj,maxDepth);
        }
        if (G1.currentDepth <= maxDepth-1) {
          G1.currentDepth++;
=======
        if (HINT_G.currentDepth <= maxDepth-1) {
          HINT_G.currentDepth++;
          s[0] = expandHint(obj,maxDepth);
        }
        if (HINT_G.currentDepth <= maxDepth-1) {
          HINT_G.currentDepth++;
>>>>>>> master
          s[2] = expandHint(prop,maxDepth);
        }
      } else {
        var obj = ln.object;
        var prop = ln.property;
        var s = ['/* */', '.', '/* */'];
<<<<<<< HEAD
        if (G1.currentDepth <= maxDepth-1) {
          G1.currentDepth++;
          s[0] = expandHint(obj,maxDepth);
        }
        if (G1.currentDepth <= maxDepth-1) {
          G1.currentDepth++;
=======
        if (HINT_G.currentDepth <= maxDepth-1) {
          HINT_G.currentDepth++;
          s[0] = expandHint(obj,maxDepth);
        }
        if (HINT_G.currentDepth <= maxDepth-1) {
          HINT_G.currentDepth++;
>>>>>>> master
          s[2] = expandHint(prop,maxDepth);
        }
      }
      return s.join('');
  }
}
<<<<<<< HEAD


function setUpAll(parsedCode, edit) {
  for (var i = 0; i < parsedCode.body.length; i++) {
    if (parsedCode.body[i].type === esprima.Syntax.FunctionDeclaration) {
      textArray = edit.session.getLines(parsedCode.body[i].loc.start.line, parsedCode.body[i].loc.end.line-2);
      var extras = {params: parsedCode.body[i].params, name: parsedCode.body[i].id.name, range: parsedCode.body[i].body.loc};
      setUp(parsedCode.body[i].body.body, textArray, "function", extras);
    } else if (parsedCode.body[i].type === esprima.Syntax.ExpressionStatement &&
    parsedCode.body[i].expression.type === esprima.Syntax.CallExpression) {
      textArray = [edit.session.getLine(parsedCode.body[i].loc.start.line-1)];
      var extras = {args: parsedCode.body[i].expression.arguments , name: parsedCode.body[i].expression.callee.name, range: parsedCode.body[i].loc};//TODO: range? necessary or even right?
      setUp(parsedCode.body[i].expression, textArray, "call", extras);
    } else {
      //it's neither a function nor call
      //will need to get start and end of this random body
      //right now, assume it's all text in editor
    }
  }
  edit.setValue(displayState());
}
=======
>>>>>>> master
