const { parseString } = require('xml2js');

const tryParse = (node) => {
  let res = node;
  try {
    res = JSON.parse(node);
  } catch (e) {
    return res;
  }
  return res;
};

const parseHTMLtext = (node) => {
  let text = node;
  if (node && node[0]) {
    if (node[0].text) {
      if (node[0].text[0]) {
        text = node[0].text[0].replace(/(\n|\t|\r)/g, '');
      } else {
        text = node[0].text.replace(/(\n|\t|\r)/g, '');
      }
    } else {
      text = typeof node[0] === 'string' ? node[0].replace(/(\n|\t|\r)/g, '') : node[0];
    }
  }
  return tryParse(text);
};

const parseAnswers = (type, answer) => answer.map(ans =>
  ({ score: parseFloat(ans.$.fraction), text: parseHTMLtext([ans]) }));

const parseTags = (tags) => {
  if (tags && tags[0] && tags[0].tag && tags[0].tag instanceof Array) {
    return tags[0].tag.map(tag => tag.text[0]);
  }
  return [];
};

const parseImage = (image) => {
  if (!image) {
    return undefined;
  }

  if (image instanceof Array) {
    if (image[0]) {
      if (image[0].image_base64) {
        return image[0].image_base64[0];
      }
      return image[0];
    }
  }
  return image;
};

const parseText = (node) => {
  if (!node) {
    return undefined;
  }
  if (node instanceof Array) {
    if (node[0]) {
      if (node[0].text) {
        return tryParse(node[0].text[0]);
      }
      return tryParse(node[0]);
    }
  }
  return node;
};
const parseSubquestions = (sub) => {
  if (!sub) {
    return undefined;
  }
  if (sub instanceof Array) {
    return sub.map(s => ({ text: parseText(s.text), answer: parseText(s.answer) }));
  }
  return sub;
};

const parseQuestion = (q, index, options = {}) => {
  try {
    let answers;
    let correctAnswer;
    if (!q || !q.$) {
      if (options.debug) console.warn(`Question ${index} is missing`);
      return null;
    }
    const { type } = q.$;

    if (type === 'category') {
      return { type, category: parseHTMLtext(q.category) };
    }
    const question = {
      type,
      name: parseHTMLtext(q.name),
      questiontext: parseHTMLtext(q.questiontext),
      format: (q.questiontext &&
        q.questiontext &&
        q.questiontext[0] &&
        q.questiontext[0].$ &&
        q.questiontext[0].$.format) ? q.questiontext[0].$.format : undefined,
      penalty: parseText(q.penalty),
      hidden: parseText(q.hidden),
      generalfeedback: parseText(q.generalfeedback),
      defaultgrade: parseText(q.defaultgrade),
      tags: parseTags(q.tags),
      img: parseImage(q.image)
    };
    switch (type) {
      case 'multichoice':
        answers = parseAnswers(type, q.answer);
        correctAnswer = answers.map((a, i) => ((a.score && (a.score > 0)) ? i : null))
          .filter(a => a !== null);
        question.answers = answers;
        question.correctAnswer = correctAnswer;
        question.single = parseText(q.single) || false;
        question.shuffleanswers = parseText(q.shuffleanswers);
        question.shuffleanswers = question.shuffleanswers === 1 || question.shuffleanswers === '1' || question.shuffleanswers === 'true';
        question.correctfeedback = parseText(q.correctfeedback);
        question.partiallycorrectfeedback = parseText(q.partiallycorrectfeedback);
        question.incorrectfeedback = parseText(q.incorrectfeedback);
        question.answernumbering = parseText(q.answernumbering);
        break;

      case 'truefalse':
        answers = parseAnswers(type, q.answer);
        [correctAnswer] = answers
          .map(a => ((a.score !== 0) ? a.text : null))
          .filter(a => a !== null);
        try {
          correctAnswer = JSON.parse(correctAnswer);
        } catch (e) {
          // Do nothing
        }
        question.answers = answers;
        question.correctAnswer = correctAnswer;
        break;

      case 'numerical':
        answers = parseAnswers(type, q.answer);
        correctAnswer = answers
          .map(a => ((a.score !== 0) ? tryParse(a.text) : null))
          .filter(a => a !== null);
        question.answers = correctAnswer;
        question.correctAnswer = correctAnswer;
        question.tolerance = parseText(q.tolerance);
        break;

      case 'matching':
        /*
        let answers = parseAnswers(type, q.answer);
        let correctAnswer = answers.map((a,i) =>
          (a.score !== 0)? i: null).filter(a => a!== null)
        question.answers = answers;
        question.correctAnswer = correctAnswer; */
        question.answers = parseSubquestions(q.subquestion);
        question.correctAnswer = question.answers.map(a => [a.text, a.answer]);
        break;

      case 'essay':
        break;

      case 'shortanswer':
        answers = parseAnswers(type, q.answer);
        correctAnswer = answers.map((a, i) => ((a.score !== 0) ? i : null))
          .filter(a => a !== null);
        question.answers = answers;
        break;
      case 'cloze':
        throw new Error('Cloze question not supported');
      case 'order':
        answers = parseSubquestions(q.subquestion);
        question.answers = answers.map(a => a.text);
        question.correctAnswer = answers.map(a => a.answer);
        question.shuffleanswers = parseText(q.shuffleanswers);
        question.shuffleanswers = question.shuffleanswers === 1 || question.shuffleanswers === '1' || question.shuffleanswers === 'true';
        break;
      case 'description':
        break;
      default:
        throw new Error('Unknown exercise type');
    }
    return question;
  } catch (error) {
    if (options.debug) {
      console.warn(`Could not parse question ${index + 1} (${JSON.stringify(q)})
    Error: ${error}`);
    }
    return null;
  }
};

const moodleXMLtoJSON = (xmlStr, callback, options = {}) => {
  parseString(xmlStr, { trim: true, normalizeTags: true }, (err, result) => {
    if (err) {
      callback(undefined, err);
      return;
    }
    try {
      const questions = result.quiz.question.map((q, i) =>
        parseQuestion(q, i, options)).filter(Boolean);
      callback({ questions }, undefined);
    } catch (e) {
      callback(undefined, e);
    }
  });
};

export default moodleXMLtoJSON;
