// import { assert } from 'chai';
const fs = require('fs');
const path = require('path');

const normalPath = path.normalize(`${__dirname}/test2.xml`);
const contents = fs.readFileSync(normalPath, 'utf8');
const moodleXMLtoJSON = require('../src');
const assert = require("chai").assert;
describe('Moodle XML to JSON', () => {
  it('should contain category', () => {
    const callback = (res,err)=>{
    	assert(!!res, true);
    	assert(res[0].type,"category")
    	assert(err,undefined)
    }
    moodleXMLtoJSON(contents, callback)
  });
  it('should contain truefalse', () => {
    const callback = (res,err)=>{
    	assert(!!res, true);
    	assert(res[1].type,"truefalse")
    	assert(err,undefined)
    }
    moodleXMLtoJSON(contents, callback)
  });
  it('should contain multichoice', () => {
    const callback = (res,err)=>{
    	assert(!!res, true);
    	assert(res[4].type,"multichoice")
    	assert(err,undefined)
    }
    moodleXMLtoJSON(contents, callback)
  });
  it('should contain shortanswer', () => {
    const callback = (res,err)=>{
    	assert(!!res, true);
    	assert(res[11].type,"shortanswer")
    	assert(err,undefined)
    }
    moodleXMLtoJSON(contents, callback)
  });

});
