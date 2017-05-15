/*
  evaluator for JS-help

  takes AST and evaluates, returns result

  TODO:
    -Implement: not, objects?
    -Be able to define a variable with no starting value
    -Catch esprima error and don't attempt to evaluate
    -Get it to work? Scopes are probably not implemented entirely correctly
      Also problems probably come up in eval
      Works with some recursive cases but not others

  Juliet Slade - Web Programming Independent Study - Spring 2017
*/


const LIMIT = 10000;
const G = {
  env: [],
  positionStack: [],
  nodes: {},
  PC: 0,
  currentUUID: undefined,
  body:undefined,
  result:undefined,
  justBroken: false,
  wait: false,
  invalidCounter: 0,
  counter:0,
  logs: []
};

function resetEval() {
  G.env = [];
  G.positionStack = [];
  G.nodes = {};
  G.PC = 0;
  G.currentUUID = undefined;
  G.body=undefined;
  G.result=undefined;
  G.justBroken = false;
  G.invalidCounter = 0;
  G.counter=0;
  G.logs = [];
}

/*
  sets up nodes for all functions
  initializes the currentUUID, the initial environment
  begins evaluation
*/
function start(body) {
  addNode(body);
  G.currentUUID = body.uid;
  var new_env = {};
  for (expression of body) {
    if (expression.type === esprima.Syntax.FunctionDeclaration) {
      const name = expression.id.name;
      const params = expression.params.map(x => x.name);
      const body = expression.body.body;
      addNode(body);
      var entry = {};
      entry['params'] = params;
      entry['body'] = body;
      entry['id'] = expression.uid;
      new_env[name] = entry;
    }
  }
  G.env.push(new_env);
  G.body = body;
  G.keepGoing = true;
  var res = eval();
  if (G.positionStack.length > 0) {
    //when execution is finished, there should not be things on the stack still
    //console.log('BAD: stuff still on the stack');
    //console.log(JSON.stringify(G.env));
  }
  return res;
}

/*
  continues evaluating as long as G.keepGoing is true and G.counter < LIMIT
  (the counter accounts for if there's an infinite loop in execution)
  It's almost certainly in here where my problems are coming from, I've reworked
  this quite a few times and it may be a weird implementation at this point.
*/
function eval() {
  while (G.keepGoing && G.counter < LIMIT) {
    G.counter++;
    if (G.body["invalid"] && G.invalidCounter === 0) {
      G.body["invalid"] = false;
    }
    if (G.body["invalid"]) { //the bodies will have an invalid added in the invalidUntilCall
      popRestore();
      G.invalidCounter--;
      G.justBroken = true;
      break;
    } else if (G.PC >= G.body.length) {
      if (G.positionStack.length === 0) {
        G.justBroken = true;
        break;
      }
      popRestore();
      G.justBroken = true;
      break;
    } else if (G.body[G.PC]) {
      var expression = G.body[G.PC];
      var newResult = evalParsedJS(expression);
      if (newResult !== undefined) {
        G.result = newResult;
      }
      if (expression.type === esprima.Syntax.ReturnStatement) {
        invalidUntilCall(G.positionStack.length-1);
        popRestore();
        //TODO: pop scope ?
        G.justBroken = true;
        break;//?
      }
      if (G.justBroken) {
        G.justBroken = false;
      } else {
        G.PC++;
      }
    }
  }
  return G.result;
}

/*
  evaluates on a statement/expression level
  If it evaluates something that has a body itself (if/else, while) or references
  a body (call), it pushes the current position on the stack and moves in to
  evaluate that body (also updating the currentUUID and body in the G object)
*/
function evalParsedJS(input) {
  var type = input.type;
  switch(type) {
    case esprima.Syntax.Literal:
      return input.value;

    case esprima.Syntax.UnaryExpression:
      if (input.operator === '-') {
        var arg = evalParsedJS(input.argument);
        return -arg;
      } else if (input.operator === '!') {
        var arg = evalParsedJS(input.argument);
        return !arg;
      } else {
        return -6;
      }

    case esprima.Syntax.UpdateExpression:
      if (input.operator === '++') {
        var arg = evalParsedJS(input.argument);
        put(input.argument.name, arg+1);
      }
      break;

    case esprima.Syntax.Identifier:
      var value = lookup(input.name, G.env);
      if (value || value === 0 || value === false || value === "" || value === null) {
        return value;
      } else {
        console.log('could not find: ' +  input.name + "\n");
        return -2;
        //variable undefined
      }

    case esprima.Syntax.ArrayExpression:
      const elements = input.elements;
      const arr = elements.map(x => evalParsedJS(x));
      return arr;

    case esprima.Syntax.ExpressionStatement:
      return evalParsedJS(input.expression);

    case esprima.Syntax.MemberExpression:
      if (input.computed) {
        //ComputedMemberExpression
        //array access like a[i]
        const obj = evalParsedJS(input.object);
        const property = evalParsedJS(input.property);
        return {'object':obj, 'parsedProp':property};
      } else {
        //StaticMemberExpression
        //array operations like push, pop, slice, length
        const obj = evalParsedJS(input.object);
        const property = input.property.name;//
        return {'object':obj, 'prop':property};
      }

    case esprima.Syntax.VariableDeclaration:
      const val = evalParsedJS(input.declarations[0].init);
      if (input.declarations[0].init.type === esprima.Syntax.MemberExpression) {
        var memberResult = memberExpHandler(input.declarations[0].init, val);
        put(input.declarations[0].id.name, memberResult);
      } else {
        put(input.declarations[0].id.name, val);
      }
      break;

    case esprima.Syntax.LogicalExpression:
      var left = evalParsedJS(input.left);
      var right = evalParsedJS(input.right);
      if (input.left.type === esprima.Syntax.MemberExpression) {
        left = memberExpHandler(input.left, left);
      }
      if (input.right.type === esprima.Syntax.MemberExpression) {
        right = memberExpHandler(input.right, right);
      }
      if (left === -4 || right === -4) {
        return -4;
      }
      return logExpEval(left, right, input.operator);

    case esprima.Syntax.BinaryExpression:
      var left = evalParsedJS(input.left);
      var right = evalParsedJS(input.right);
      if (input.left.type === esprima.Syntax.MemberExpression) {
        left = memberExpHandler(input.left, left);
      }
      if (input.right.type === esprima.Syntax.MemberExpression) {
        right = memberExpHandler(input.right, right);
      }
      if (left === -4 || right === -4) {
        return -4;
      }
      return binExpEval(left, right, input.operator);

    case esprima.Syntax.AssignmentExpression:
      //this makes some assumptions
      var value = lookup(input.left.name, G.env);
      if (value || value === 0 || value === false || value === ""
          || value === null || input.left.type === esprima.Syntax.MemberExpression) {
        const right = evalParsedJS(input.right);
        var rightResult = right;
        if (input.right.type === esprima.Syntax.MemberExpression ||
        input.left.type === esprima.Syntax.MemberExpression) {
          if (input.right.type === esprima.Syntax.MemberExpression) {
            rightResult = memberExpHandler(input.right, right);
          }
          if (input.left.type === esprima.Syntax.MemberExpression) {
            const left = evalParsedJS(input.left);
            var pp = left.parsedProp;
            var o = left.object;
            o[pp] = rightResult;
            break;
          }
        }
        put(input.left.name, rightResult);
        break;
      } else {
        //the variable hasn't been defined, strict now, don't allow variables without var
        console.log('can not find: ' + input.left.name + ' for assignment');
        return -3;
      }
      break;

    case esprima.Syntax.FunctionDeclaration:
      if (!input.body.uid) {
        addNode(input.body);
      }
      const name = input.id.name;
      if (!G.env[0][name]) { //for some reason //maybe first level
        const name = input.id.name;
        const params = input.params.map(x => x.name);
        const body = input.body.body; //the body is a BlockStatement, get body of that
        addNode(input);
        var entry = {};
        entry['params'] = params;
        entry['body'] = body;
        entry['id'] = expression.uid;
        G.env[0][name] = entry;
      }
      break;

    case esprima.Syntax.CallExpression:
      if (input.callee.type === esprima.Syntax.Identifier) {
        const callee = input.callee.name;
        const argVals = input.arguments.map(x => evalParsedJS(x));
        //bind arguments and values
        if (lookup(callee, G.env)) {
          const body = lookup(callee, G.env).body;
          const params = lookup(callee, G.env).params;
          const id = lookup(callee, G.env).id;
          bindVals(params, argVals);
          if (body["invalid"]) {
            body["invalid"] = false;
          }
          pushPosition(body.uid);
          G.positionStack.push('call');
          G.body = body;
          G.PC = 0;
          G.keepGoing = true;
          var call_result = eval();
          G.env.pop();
          return call_result;
        } else if (callee === 'alert') {
          alert(argVals);
          break;
        } else if (callee === 'prompt') {
          return prompt(argVals);
        } else if (callee === 'parseFloat') {
          return parseFloat(argVals);
        } else if (callee === 'parseInt') {
          return parseInt(argVals);
        } else if (callee === 'isNaN') {
          return isNaN(argVals);
        } else {
          console.log('Function: ' + callee + ' has not yet been defined');
          return -1;
          //function hasn't been defined
        }
      } else {
        //its type is MemberExpression
        const objProp = evalParsedJS(input.callee);
        const obj = objProp.object;
        const prop = objProp.prop;
        if (input.arguments.length > 0) {
          const args = input.arguments.map(x => evalParsedJS(x));
          for (var i = 0; i < args.length; i++) {
            if (args[i]["object"] && args[i]["prop"]) {
              args[i] = memberExpHandler(input.arguments[i], args[i]);
            }
          }
          if (prop === "push") {
            obj.push(args[0]);
            break;
          } else if (prop === "slice") {
            return obj.slice(args[0], args[1]);
          } else if (prop === 'charAt') {
            return obj.charAt(args[0]); //args in general?
          } else if (prop === 'floor') { //Math is not a variable
            return Math.floor(args[0]); //args in general?
          } else if (prop === 'log') { //console is not a variable
            G.logs.push(args[0]);
            write(args);
            break;
          } else if (prop === 'fromCharCode') { //String is not a variable
            return String.fromCharCode(args);
          } else if (prop === 'charCodeAt') {
            return obj.charCodeAt(args);
          }
        } else {
          //pop(), length, random
          if (prop === 'pop') {
            return obj.pop();
          } else if (prop === 'length') {
            return obj.length;
          } else if (prop === 'random') {
            return Math.random();
          } else if (prop === 'shift') {
            var s = obj.shift();
            return s;
          }
        }

      }
      break;

    case esprima.Syntax.IfStatement:
      const test = input.test;
      const then = input.consequent; //BlockStatement
      const alternate = input.alternate; //BlockStatement
      if (evalParsedJS(test)) {
        if (!input.consequent.body.uid) {
            addNode(input.consequent.body);
        }
        pushPosition(input.consequent.body.uid);
        G.body = then.body;
        G.PC = 0;
        G.keepGoing = true;
        return eval();
      } else if (input.alternate !== null) {
          if (alternate.type === esprima.Syntax.IfStatement) {
            return evalParsedJS(alternate);
          } else {
            if (!input.alternate.body.uid) {
              addNode(input.alternate.body);
            }
            pushPosition(input.alternate.body.uid);
            G.body = alternate.body;
            G.PC = 0;
            G.keepGoing = true;
            return eval();
          }
        }
      break;

    case esprima.Syntax.WhileStatement:
      const condition = input.test;
      const inBody = input.body;
      if (!inBody.body.uid) {
        addNode(inBody.body);//Because it's a BlockStatement (right?)
      }
      var parsedWhile = evalParsedJS(condition);
      if (typeof parsedWhile === 'object') {
        parsedWhile = parsedWhile["object"].length; //the while contains an array.length, I believe
      }
      if (parsedWhile) {
        pushPosition(inBody.body.uid, whileStatement=true);
        G.body = inBody.body;
        G.PC = 0
        G.keepGoing = true;
        return eval();
      }
      break;

    case esprima.Syntax.BlockStatement:
      return evalParsedJS(input.body);

    case esprima.Syntax.ReturnStatement:
      //In case it is just return and doesn't have an arg
      if (input.argument) {
        G.sameReturn = true;
        const arg = evalParsedJS(input.argument);
        G.sameReturn = false;
        return arg;
      } else {
        return;
      }
  }
}

/* binary expression evaluators - algebraic and boolean */
function binExpEval(left, right, op) {
  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '/':
      return left / right;
    case '*':
      return left * right;
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '===':
      return left === right;
    case '!==':
      return left !== right;
    case '%':
      return left % right;
  }
}

function logExpEval(left, right, op) {
  switch (op) {
    case '&&':
      return left && right;
    case '||':
      return left || right;
  }
}
