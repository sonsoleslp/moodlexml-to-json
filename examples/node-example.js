/* eslint-disable no-console */
const moodleXMLtoJSON = require('../lib');
const fs = require('fs');
const path = require('path');

const normalPath = path.normalize(`${__dirname}/../test/test2.xml`);
const contents = fs.readFileSync(normalPath, 'utf8');

const callback = (result, error) => {
	if (error) {
		console.error(error)
		return;
	}

	console.log(result)

}
moodleXMLtoJSON(contents, callback); 