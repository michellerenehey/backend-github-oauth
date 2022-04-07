const fetch = require('cross-fetch');

module.exports = class Quotes {
  static getQuotes() {
    const arr = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://quotes.rest/qod?language=en',
      'https://api.quotable.io/random',
    ];
    const promiseArray = arr.map((api) => fetch(api));

    return Promise.all(promiseArray)
      .then((response) => {
        return Promise.all(response.map((item) => item.json()));
      })
      .then((quoteArray) =>
        quoteArray.map((item) => {
          if (item.success) {
            return {
              author: item.contents.quotes[0].author,
              content: item.contents.quotes[0].quote,
            };
          } else if (item.author) {
            return { author: item.author, content: item.content || item.en };
          } else {
            return { author: 'no author', content: 'no content' };
          }
        })
      );
  }
};
