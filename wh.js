#!/usr/bin/env node

const rp = require('request-promise');
const cheerio = require('cheerio');
const dictionary = require('./dictionary.json');

const question = process.argv.length > 2 &&
  process.argv.slice(2)
    .join(' ')
    .trim();

if (question) {
  const options = {
    uri: `https://www.google.com/search?q=${encodeURIComponent(question)}&ie=UTF-8&hl=en&gl=en`,
    encoding: 'utf8',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    },
    transform: body => cheerio.load(body),
  };

  rp(options)
    .then($ => ({
      answer1: $('.vk_bk.vk_ans').first().text(),
      answer2: $('._XWk').first().text(),
      answer3: $('#_Cif input').val() && `${$('#_Cif input').val()} ${$('#_Cif select').val()}`,
      answer4: $('#cwos').text(),
      // secondary: `${$('.vk_gy.vk_sh').first().text()}`,
    }))
    .then(({
      answer1,
      answer2,
      answer3,
      answer4,
    }) => {
      console.log((answer1 || answer2 || answer3 || answer4 || dictionary.NO_ANSWER[Math.round(Math.random() * dictionary.NO_ANSWER.length)]).trim());
    })
    .catch(() => {
      console.error(dictionary.ERROR[Math.round(Math.random() * dictionary.ERROR.length)]);
    });
}
else {
  console.log(dictionary.NO_QUESTION[Math.round(Math.random() * dictionary.NO_QUESTION.length)]);
}
