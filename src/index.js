const { parseString } = require('xml2js');

const parseHTMLtext = (node) => {
  const text = node[0].text[0].replace(/(\n|\t|\r)/g, '');
  return text;
};

const parseAnswers = (type, answer) => answer.map(ans =>
  ({ score: parseFloat(ans.$.fraction), text: parseHTMLtext([ans]) }));


const parseQuestion = (q) => {
  let answers;
  let correctAnswer;
  const { type } = q.$;

  if (type === 'category') {
    return { type, category: parseHTMLtext(q.category) };
  }

  const question = {
    type,
    name: parseHTMLtext(q.name),
    questiontext: parseHTMLtext(q.questiontext),
    penalty: q.penalty,
    hidden: q.hidden,
    generalfeedback: q.generalfeedback,
    defaultgrade: q.defaultgrade,
    tags: q.tags ? q.tags : [] // TODO
  };
  switch (type) {
    case 'multichoice':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map((a, i) => ((a.score !== 0) ? i : null)).filter(a => a !== null);
      question.answers = answers;
      question.correctAnswer = correctAnswer;
      question.single = q.single ? JSON.parse(q.single) : undefined;
      question.shuffleanswers = q.shuffleanswers === 1 || q.shuffleanswers === '1';
      question.correctfeedback = q.correctfeedback;
      question.partiallycorrectfeedback = q.partiallycorrectfeedback;
      question.incorrectfeedback = q.incorrectfeedback;
      question.answernumbering = q.answernumbering;
      break;
    case 'truefalse':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map((a, i) => ((a.score !== 0) ? i : null)).filter(a => a !== null);
      question.answers = answers;
      question.correctAnswer = correctAnswer;
      question.tolerance = q.tolerance;
      break;
    case 'numerical':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map((a, i) => ((a.score !== 0) ? i : null)).filter(a => a !== null);
      question.answers = answers;
      question.correctAnswer = correctAnswer;
      break;
    case 'matching':
      /*
      let answers = parseAnswers(type, q.answer);
      let correctAnswer = answers.map((a,i) =>
        (a.score !== 0)? i: null).filter(a => a!== null)
      question.answers = answers;
      question.correctAnswer = correctAnswer; */
      break;
    case 'essay':
      break;
    case 'shortanswer':
      answers = parseAnswers(type, q.answer);
      correctAnswer = answers.map((a, i) => ((a.score !== 0) ? i : null)).filter(a => a !== null);
      question.answers = answers;
      break;
    default:
      throw new Error('Unknown exercise type');
  }

  return question;
};

const moodleXMLtoJSON = (xmlStr, callback) => {
  parseString(xmlStr, (err, result) => {
    if (err) {
      callback(undefined, err);
      return;
    }
    try {
      const questions = result.quiz.question.map(q => parseQuestion(q));
      callback(questions, undefined);
    } catch (e) {
      callback(undefined, e);
    }
  });
};

export default moodleXMLtoJSON;
