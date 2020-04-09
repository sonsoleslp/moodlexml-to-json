// import { assert } from 'chai';
const fs = require('fs');
const path = require('path');

const normalPath = path.normalize(`${__dirname}/test.xml`);
const contents = fs.readFileSync(normalPath, 'utf8');
const moodleXMLtoJSON = require('../src');
const assert = require("chai").assert;


const createCallback = (assertFun) => {
  return (res,err) => {
    let questions = (res && res.questions) ? res.questions : res;
    assertFun(questions, err);
  }
}

describe('General XML to JSON', () => {
  it('should parse', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(!!res, true)));
  });

  it('should not parse', () => {
    moodleXMLtoJSON("WRONG XML", createCallback((res, err)=> assert(!!err, true)));
  });

  it('should not have errors', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(err,undefined)));
  });

  it('should not recognize exercise type', () => {
    moodleXMLtoJSON(contents.replace("numerical", "unknown")
      , createCallback((res, err)=> assert(!!err, true)))
 
  });
});

describe('Category', () => {
  it('should contain category', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[0].type, "category")));
  });
});

describe('Truefalse exercise', () => {
  it('should contain truefalse', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[1].type, "truefalse")));
  });
});

describe('Multiple choice exercise', () => {
it('should contain multichoice', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[4].type, "multichoice")));
  });
});

describe('Short answer exercise', () => {
it('should contain shortanswer', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[11].type, "shortanswer")));
  });
});

describe('Matching exercise', () => {
  it('should contain matching', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[15].type, "matching")));
  });
});
 
describe('Numerical exercise', () => {
  it('should contain numerical', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[16].type, "numerical")));
  });
});
  
describe('Essay exercise', () => {
  it('should contain essay', () => {
    moodleXMLtoJSON(contents, createCallback((res, err)=> assert(res[17].type, "essay")));
  });
}); 

