'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('xml2js'),
    parseString = _require.parseString;

var parseHTMLtext = function parseHTMLtext(node) {
  var text = node[0].text[0].replace(/(\n|\t|\r)/g, '');
  return text;
};

var parseAnswers = function parseAnswers(type, answer) {
  return answer.map(function (ans) {
    return { score: parseFloat(ans.$.fraction), text: parseHTMLtext([ans]) };
  });
};

var parseQuestion = function parseQuestion(q) {
  var answers = void 0;
  var correctAnswer = void 0;
  var type = q.$.type;


  if (type === 'category') {
    return { type: type, category: parseHTMLtext(q.category) };
  }

  var question = {
    type: type,
    name: parseHTMLtext(q.name),
    questiontext: parseHTMLtext(q.questiontext),
    penalty: q.penalty,
    hidden: q.hidden,
    generalfeedback: q.generalfeedback,
    defaultgrade: q.defaultgrade,
    tags: q.tags
  };
  switch (type) {
    case 'multichoice':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map(function (a, i) {
        return a.score !== 0 ? i : null;
      }).filter(function (a) {
        return a !== null;
      });
      question.answers = answers;
      question.correctAnswer = correctAnswer;
      question.single = q.single ? JSON.parse(q.single) : undefined;
      question.shuffleanswers = q.shuffleanswers == 1;
      question.correctfeedback = q.correctfeedback;
      question.partiallycorrectfeedback = q.partiallycorrectfeedback;
      question.incorrectfeedback = q.incorrectfeedback;
      question.answernumbering = q.answernumbering;
      break;
    case 'truefalse':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map(function (a, i) {
        return a.score !== 0 ? i : null;
      }).filter(function (a) {
        return a !== null;
      });
      question.answers = answers;
      question.correctAnswer = correctAnswer;
      question.tolerance = q.tolerance;
      break;
    case 'numerical':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map(function (a, i) {
        return a.score !== 0 ? i : null;
      }).filter(function (a) {
        return a !== null;
      });
      question.answers = answers;
      question.correctAnswer = correctAnswer;
      break;
    case 'matching':
      /* let answers = parseAnswers(type, q.answer);
      let correctAnswer = answers.map((a,i) => (a.score !== 0)? i: null).filter(a => a!== null)
      question.answers = answers;
      question.correctAnswer = correctAnswer; */
      break;
    case 'essay':
      break;
    case 'shortanswer':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map(function (a, i) {
        return a.score !== 0 ? i : null;
      }).filter(function (a) {
        return a !== null;
      });
      question.answers = answers;
      break;
    default:
      throw new Error('Unknown exercise type');
  }

  return question;
};

var moodleXMLtoJSON = function moodleXMLtoJSON(xmlStr, callback) {
  parseString(xmlStr, function (err, result) {
    if (err) {
      callback(undefined, err);
      return;
    }
    try {
      var questions = result.quiz.question.map(function (q) {
        return parseQuestion(q);
      });
      callback(questions, undefined);
    } catch (e) {
      callback(undefined, e);
    }
  });
};

exports.default = moodleXMLtoJSON;
module.exports = exports['default'];
