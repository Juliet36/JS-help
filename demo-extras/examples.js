/*
<<<<<<< HEAD
examples.js
Examples for demo portion of NAME
Defines an object, GLOBAL.examples:
{
  Easy {
    "loops": [DEMO_OBJ*]
  },
  Intermediate {
    "loops": [DEMO_OBJ*]
  },
  Hard {
    "loops": [DEMO_OBJ*]
  }
}
When there are other demo types ("conditionals" for example),
these will be added into each level in the same format as "loops".

DEMO_OBJ = {
  solution: String representation of code,
  prompt: String representation of prompt,
  tests: [{test:String, answer:String|Boolean|Integer}*],
  hasLogs: Boolean //only a property if solution uses console.log()
}

Juliet Slade - Web Programming Independent Study - Spring 2017
=======
  Examples for demo portion of JS-help
  Defines an object, GLOBAL.examples:
  {
    Easy {
      "loops": [DEMO_OBJ*]
    },
    Intermediate {
      "loops": [DEMO_OBJ*]
    },
    Hard {
      "loops": [DEMO_OBJ*]
    }
  }
  When there are other demo types ("conditionals" for example),
  these will be added into each level in the same format as "loops".

  DEMO_OBJ = {
    solution: String representation of code,
    prompt: String representation of prompt,
    tests: [{test:String, answer:String|Boolean|Integer}*],
    hasLogs: Boolean //only a property if solution uses console.log()
  }

  Juliet Slade - Web Programming Independent Study - Spring 2017
>>>>>>> master
*/

var COUNTER =
{
  solution:
"function counter(n) {     \n \
    var i = 0;            \n \
    while (i <= n) {       \n \
      console.log(i);     \n \
      i = i + 1;          \n \
    }                     \n \
  }                       \n \
",
  prompt:
  "Use a while loop to print the numbers from 0 to n",
  tests:
  [{test: "counter(5)", answer: "[0,1,2,3,4,5]"},
  {test: "counter(0)", answer: "[0]"}],
  hasLogs: true
};

var SUM =
{
  solution:
"function sum(n) {         \n \
    var result = 0;       \n \
    var i = 0;            \n \
    while (i <= n) {       \n \
      result = result + i;\n \
      i = i + 1;          \n \
    }                     \n \
    return result;        \n \
  }                       \n \
",
  prompt:
  "Use a while loop to sum the numbers from 0 to n",
  tests:
  [{test:"sum(5);", answer:15}, {test:"sum(0);", answer:0}]
};

var FACT =
{
  solution:
"function factorial(n) {         \n \
    var result = 1;       \n \
    var i = 1;            \n \
    while (i <= n) {       \n \
      result = result * i;\n \
      i = i + 1;          \n \
    }                     \n \
    return result;        \n \
  }                       \n \
",
  prompt:
  "Use a while loop to find the product of the numbers from 1 to n",
  tests:
  [{test:"factorial(5);", answer:120}, {test:"factorial(0);", answer:1}]
}

var ARRAY_SUM =
{
  solution:
"function arrSum(a) {         \n \
    var i = 0;                \n \
    var result = 0;           \n \
    while (i < a.length) {    \n \
      result = result + a[i]; \n \
      i = i + 1;              \n \
    }                         \n \
    return result;            \n \
  }                           \n \
",
  prompt:
  "Use a while loop to sum the elements of an array",
  tests:
  [{test:"arrSum([]);", answer:0}, {test:"arrSum([1,2,-3]);", answer:0}, {test:"arrSum([1,2,3]);", answer:6}]
};

var ULAM =
{
  solution:
"function ulam(x) {            \n \
    var counter = 0;          \n \
    while (x !== 1) {         \n \
      if (x % 2 === 0) {      \n \
        x = x / 2;            \n \
      } else {                \n \
        x = 3 * x + 1;        \n \
      }                       \n \
      counter = counter + 1;  \n \
    }                         \n \
    return counter            \n \
  }                           \n \
",
  prompt:
  "Use a while loop to find out how many applications of the collatz rule it takes \
  to reach 1. If x is even, divide it by 2. If it's odd, multiply it by 3 and add 1",
  tests:
  [{test:"ulam(5);", answer:5}, {test:"ulam(1);", answer:0}]
};

var STR_REVERSE =
{
  solution:
"function reverseString(s) {   \n \
  var reverse = '';           \n \
  var i = s.length-1;         \n \
  while (i >= 0) {            \n \
    reverse = reverse + s.charAt(i); \n \
    i = i - 1;                \n \
  }                           \n \
  return reverse;             \n \
}                             \n \
",
  prompt:
  "Use a while loop to reverse the characters in a string",
  tests:
  [{test:"reverseString('racecar');", answer:"racecar"}, {test:"reverseString('');", answer:""}]
};

var ASTERISK =
{
  solution:
"function asteriskString(n) {\n \
  var s = '';\n \
  var i = 0;\n \
  while (i < n) {\n \
    s = s + \'*\';\n \
    i = i + 1;\n \
  }\n \
  return s;\n \
}",
  prompt:
  "Use a while loop to build up a string of n asterices",
  tests:
  [{test:"asteriskString(5);", answer:"*****"}, {test:"asteriskString(0);", answer:""}]
}

var PRINT_NUMS =
{
  solution:
  "function print(x) { \n \
    var i = 0; \n \
    while (i <= x) { \n \
      if (i % 2 === 0) { \n \
        console.log(i * i); \n \
      } else { \n \
        console.log(i); \n \
      } \n \
      i = i + 1; \n \
    } \n \
  }",
  prompt:
  "Print the numbers from 0 to x, if they're even print the square \
  if they're odd, print it as is",
  tests:
  [{test: "print(5)", answer: "[0,1,4,3,16,5]"},
  {test: "print(0)", answer: "[0]"}],
  hasLogs: true
};

var SHIFT_ARR =
{
  solution:
"function shiftArr(a) {        \n \
  var last = a[a.length-1];   \n \
  var i = a.length-1;         \n \
  while (i > 0) {             \n \
    a[i] = a[i-1];            \n \
    i = i - 1;                \n \
  }                           \n \
  a[0] = last;                \n \
  return a;                   \n \
}                             \n \
",
  prompt:
  "Use a while loop to shift the elements of an array back one place. \n \
  Be sure to move the first element to the end.",
  tests:
  [{test:"shiftArr([1,2,3]);", answer:"[3,1,2]"}]
};

var DOUBLE_ARR =
{
  solution:
  "function doubleArray(a) {\n \
    var i = 0;\n \
    while (i < a.length) {\n \
        a[i] = a[i] * 2;\n \
        i = i + 1;\n \
    }\n \
    return a;\n \
}",
  prompt:
  "Use a while loop to double all the elements of an array",
  tests:
  [{test:"doubleArray([1,2,3])",answer:"[2,4,6]"}, {test:"doubleArray([0])", answer:"[0]"}]
};

GLOBAL.examples = {
  "easy": {
      "loops": [COUNTER, SUM, FACT, ASTERISK]
  },
  "intermediate": {
    "loops": [ARRAY_SUM, STR_REVERSE, PRINT_NUMS, DOUBLE_ARR]
  },
  "hard": {
    "loops": [ULAM, SHIFT_ARR]
  }
}
