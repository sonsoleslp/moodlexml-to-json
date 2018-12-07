// import { assert } from 'chai';
const fs = require('fs');
const path = require('path');

const normalPath = path.normalize(`${__dirname}/test2.xml`);
const contents = fs.readFileSync(normalPath, 'utf8');
const moodleXMLtoJSON = require('../src');
const assert = require("chai").assert;
describe('General XML to JSON', () => {
  it('should parse', () => {
    const callback = (res,err)=>{
      assert(!!res, true);
    }
    moodleXMLtoJSON(contents, callback)
  });

  it('should not have errors', () => {
    const callback = (res,err)=>{
      assert(err,undefined)
    }
    moodleXMLtoJSON(contents, callback)
  });
});
describe('Category', () => {
  it('should contain category', () => {
    const callback = (res,err)=>{
      assert(res[0].type,"category")
    }
    moodleXMLtoJSON(contents, callback)
  });
});
describe('Truefalse exercise', () => {
  it('should contain truefalse', () => {
    const callback = (res,err)=>{
      assert(res[1].type,"truefalse")
    }
    moodleXMLtoJSON(contents, callback)
  });
});
describe('Multiple choice exercise', () => {
  it('should contain multichoice', () => {
    const callback = (res,err)=>{
      assert(res[4].type,"multichoice")
    }
    moodleXMLtoJSON(contents, callback)
  });
});
describe('Short answer exercise', () => {
  it('should contain shortanswer', () => {
    const callback = (res,err)=>{
      assert(res[11].type,"shortanswer")
    }
    moodleXMLtoJSON(contents, callback)
  });
});
describe('Matching exercise', () => {
    it('should contain matching', () => {
    const callback = (res,err)=>{
      assert(res[15].type,"matching")
    }
    moodleXMLtoJSON(contents, callback)
  });
});
 

  

