/*
  auxiliary functions for the JS-help evaluator

  Juliet Slade - Web Programming Independent Study - Spring 2017
*/


/* Functions for the positionStack */

//pushes a uuid onto the stack along with the PC incremented
//by 1, unless it's a while loop
//with a while loop, you want to evaluate the condition again
//and not necessarily move on once you've completed an iteration
function pushPosition(uuid, whileStatement=false) {
  var pos = {};
  var PC = G.PC;
  if (!whileStatement && G.lastPop !== G.currentUUID) {
    PC += 1;
  }
  pos[G.currentUUID] = PC;
  pos["keepGoing"] = G.keepGoing;
  G.positionStack.push(pos);
  G.currentUUID = uuid;
}

//pops the last position from the position stack
//and configures the evaluator to evaluate that body
function popRestore() {
  var pos = G.positionStack.pop();
  if (pos === 'call') {
    pos = G.positionStack.pop();
  }
  G.lastPop = Object.keys(pos)[0];
  if (pos !== 'call') {
    var uuid = Object.keys(pos)[0];
    G.currentUUID = uuid;
    G.PC = pos[uuid];
    G.body = G.nodes[uuid];
    G.keepGoing = pos["keepGoing"];
    return G.body;
  } else {
    //shouldn't happen
    console.log('is happening, though');
  }
}

//invalidates all bodies on the position stack
//up to the "call" string in the list
//if we've finished executing a called function we want to
//return to the place that called it (even if it's within a body
//that's within another body, like an if within a function)
function invalidUntilCall(i) {
  if (G.positionStack[i] === 'call') {
    G.positionStack.splice(i,1);
    return G.positionStack;
  } else {
    var uuid = Object.keys(G.positionStack[i])[0];
    var body = G.nodes[uuid];
    body["invalid"] = true;
    G.invalidCounter++;
    return invalidUntilCall(i-1);
  }
}


/* Scope Functions*/

function lookup(name, env) {
  if (env.length === 0) {
    return false;
  } else if (name in env[env.length-1]) {
    return env[env.length-1][name];
  } else {
    return lookup(name, env.slice(0, env.length-1));
  }
}

function bindVals(new_syms, new_vals) {
  const new_env = {};
  for (var i = 0; i < new_syms.length; i++) {
    new_env[new_syms[i]] = new_vals[i];
  }
  G.env.push(new_env);
}

function put(name, value) {
  G.env[G.env.length-1][name] = value;
}


/* Misc */

//Single place to do this rather than in every
//place that there's a memberExp
//either returns an element of an array, the length of
//an array or the created member object itself
function memberExpHandler(memExpAST, memExpObj) {
  if (memExpAST.computed) {
    var pp = memExpObj.parsedProp;
    var o = memExpObj.object;
    return o[pp];
  } else {
    if (memExpObj.prop) {
      if (memExpObj.prop === 'length') {
        return memExpObj.object.length;
      } else {
        return -4;
      }
    } else {
      return memExpObj;
    }
  }
}

//This will take FunctionDeclaration, WhileStatement, IfStatement, ?
function addNode(node) {
  const uuid = guid();
  node.uid = uuid;
  G.nodes[uuid] = node;
}

//UUID generator
//source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
