# MoodleXML to JSON

[![Build Status](https://travis-ci.org/sonsoleslp/moodlexml-to-json.svg?branch=master)](https://travis-ci.org/sonsoleslp/moodlexml-to-json) 
[![dependencies Status](https://david-dm.org/sonsoleslp/moodlexml-to-json/status.svg)](https://david-dm.org/sonsoleslp/moodlexml-to-json) [![devDependencies Status](https://david-dm.org/sonsoleslp/moodlexml-to-json/dev-status.svg)](https://david-dm.org/sonsoleslp/moodlexml-to-json?type=dev) 
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


This JS library parses MoodleXML quizzes into JSON objects.

## Usage

```
import moodleXMLtoJSON from 'moodlexml-to-json';
// ...
moodleXMLtoJSON(xmlString, (result, error) => {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
}); 
```
## Examples

On the server

```
import moodleXMLtoJSON from 'moodlexml-to-json';
const fs = require('fs');
const path = require('path');

const xmlString = fs.readFileSync("/path/to/your/file.xml", 'utf8');

moodleXMLtoJSON(xmlString, (result, error) => {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
}); 

```

On a JS SPA

```
import moodleXMLtoJSON from 'moodlexml-to-json';
// ...
fetch("https://myweb.org/moodle.xml")
  .then(res=>res.text())
  .then(xmlString => {
  	moodleXMLtoJSON(xmlString, (result, error) => {
  		if (error) {
  			console.error(error);
  		} else {
  			console.log(result);
  		}
  	}); 
});
```

## Development 
 
### Commands
- `npm run clean` - Remove `lib/` directory
- `npm test` - Run tests with linting and coverage results.
- `npm test:only` - Run tests without linting or coverage.
- `npm test:watch` - You can even re-run tests on file changes!
- `npm test:prod` - Run tests with minified code.
- `npm run test:examples` - Test written examples on pure JS for better understanding module usage.
- `npm run lint` - Run ESlint with airbnb-config
- `npm run cover` - Get coverage report for your code.
- `npm run build` - Babel will transpile ES6 => ES5 and minify the code.
- `npm run prepublish` - Hook for npm. Do all the checks before publishing your module.

## License

MIT © Sonsoles López Pernas
