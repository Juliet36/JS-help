/*
  interactive webpage handlers for JS-help
  functions connecting to buttons on the html page:
    -Initialize
    -Run
    -<=Copy
    -Copy=>
    -Next Problem

  handles two modes:
    -Free Reign
      * edit and evaluate in the left ace editor
      * edit and generate hint version of code in the right ace editor
      * copy code over from each side to the other
    -Demo
      * receive prompts for various levels of problems in the prompt area
      * generate hints in the right ace editor
      * copy hints over when you want to
      * edit and evaluate in the left ace editor

  Juliet Slade - Web Programming Independent Study - Spring 2017
*/

const LEVEL_START = "intermediate";
const MOVE_DOWN_TRIES = 15; //number of tries before the level decreases
const MOVE_UP_TRIES = 5; //number of tries before the level increases
const levels = ["easy", "intermediate", "hard"];


//Connected to "Evaluate" button
function runCode() {
  const code = edit.getValue();
  const parsedCode = esprima.parse(code);
  resetEval();
  const result = start(parsedCode.body);
  console.log("Result " + JSON.stringify(result));
  console.log("World " + JSON.stringify(G.symbolTable));
  var answerElement = document.getElementById('messages');
  if (result || result === 0 || result === false) {
    write(JSON.stringify(result));
  } else if (result === null) {
    write('null');
  } else {
    answerElement.innerHTML = "";
  }
}

//version of evaluate for moving on to the next level
//doesn't grab code from evaluator, instead takes code that's passed in
//and just returns the result rather than writing it
function evaluate(code) {
  const parsedCode = esprima.parse(code);
  resetEval();
  const result = start(parsedCode.body);
  return result;
}

//Connected to "Initialize" button
//takes code in hint element and generates the folded up hint version
function initializeHint(cd) {
    var code;
    if (cd === undefined) {
      code = hints.getValue();
    } else {
      hints.setValue(cd);
      code = cd;
    }
    const parsedCode = esprima.parse(code, {loc:true});
    reset();
    setUpAll(parsedCode, hints);
    edit.setValue("");
}

//Connected to "Copy=>"/"<=Copy" buttons
function copyOver(from,to) {
  const hintCode = from.getValue();
  to.setValue(hintCode);
}

//Connected to the selection element
//Handles the switch between "Free Reign" and "Demo" modes
function changeWindow() {
  var option = document.getElementById("windowOptions").value;
  if (option === "free") {
    displayPrompt("none");
    hints.setValue("hint code here");
    edit.setValue("edit code here");
    document.getElementById("Button3").style.display= "block";
    document.getElementById("Button2").setAttribute("onclick", "hintButton();");
    document.getElementById("Button2").innerHTML =  "Initialize";
    document.getElementById("Button2").style.background="lightgray";
    GLOBAL.hint = false;
  } else if (option == "demo") {
    displayPrompt("block");
    hints.setValue("press 'Next Problem' to get the first problem");
    edit.setValue("edit code here");
    document.getElementById("Button3").style.display= "none";
    GLOBAL.hintsUsed = 0;
    GLOBAL.level = LEVEL_START;
    document.getElementById("Button2").setAttribute("onclick", "nextPrompt();");
    document.getElementById("Button2").innerHTML =  "Next Problem";
  }
}

//Connected to the "Next Problem" button
//tests the users currently entered code, if it passes the tests, it moves
//on to the next prompt
function nextPrompt() {
  if (GLOBAL.problem === undefined) {
    var numProbs = GLOBAL.examples[GLOBAL.level]["loops"].length
    GLOBAL.problem = GLOBAL.examples[GLOBAL.level]["loops"][Math.floor(Math.random() * numProbs)];
    document.getElementById("prompt-p").innerHTML = GLOBAL.problem.prompt;
    initializeHint(GLOBAL.problem.solution);
    document.getElementById("Button2").style.background="red";
  } else {
    if (GLOBAL.moveOn) {
      document.getElementById("prompt-p").innerHTML = GLOBAL.problem.prompt;
      initializeHint(GLOBAL.problem.solution);
      GLOBAL.moveOn = false;
      clearMessages();
      document.getElementById("Button2").style.background="red";
    } else {
      document.getElementById("Button2").style.background="red";
      if (testAnswer(GLOBAL.problem) && GLOBAL.problem) {
        //clearMessages();
        nextLevel();
        GLOBAL.hintsUsed = 0;
        var numProbs = GLOBAL.examples[GLOBAL.level]["loops"].length;
        var randomNum = Math.floor(Math.random() * numProbs);
        GLOBAL.problem = GLOBAL.examples[GLOBAL.level]["loops"][randomNum];
        GLOBAL.moveOn = true;
        document.getElementById("Button2").style.background="lightgray";
      }
    }
  }
}

//Runs the tests on the current problem and the user's code in the edit element,
//returns true if all tests run successfully
function testAnswer(problem) {
  if (problem.tests === undefined) {
    return true;
  }
  var tests = problem.tests;
  var i = 0;
  var correct = true;
  while (i < tests.length && correct) {
    var test = edit.getValue() + "\n" + tests[i].test;
    var result = evaluate(test);
    if (problem.hasLogs) {
      result = JSON.stringify(G.logs);
    }
    if (typeof(result) === "object") {
      result = JSON.stringify(result);
    }
    if (result === tests[i].answer) {
      write("Evaluated " + tests[i].test + " correctly => " + JSON.stringify(tests[i].answer));
    } else {
      write("Failed on " + tests[i].test + " got => " + result);
      correct = false;
    }
    i++;
  }
  return correct;
}

//Figures out the next level to move to
function nextLevel() {
  var levelPos = levels.indexOf(GLOBAL.level);
  var nextLevelPos = levelPos;
  if (GLOBAL.hintsUsed > MOVE_DOWN_TRIES) {
    nextLevelPos = levelPos-1;
  } else if (GLOBAL.hintsUsed < MOVE_UP_TRIES) {
    nextLevelPos = levelPos+1;
  }
  if (nextLevelPos === -1) {
    nextLevelPos = 0;
  }
  if (nextLevelPos === 3) {
    nextLevelPos = 2;
  }
  GLOBAL.level = levels[nextLevelPos];
}

function displayPrompt(displayStyle) {
  var promptElement = document.getElementById("prompt");
  promptElement.style.display = displayStyle;
}

/* Textarea Functions */
function write(message) {
    var messageArea = document.getElementById("messages");
    messageArea.value = messageArea.value + "> " + message + "\n";
    messageArea.scrollTop = messageArea.scrollHeight;
}

function clearMessages() {
  var messageArea = document.getElementById("messages");
  messageArea.value = "";
}
