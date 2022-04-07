const fetch = require('cross-fetch');

module.exports = class Quotes {
  static async getQuotes() {
    const arr = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://quotes.rest/qod?language=en',
      'https://api.quotable.io/random',
    ];
    const promiseArray = arr.map((api) => fetch(api));

    const quoteArray = await Promise.all(promiseArray).then((response) => {
      return Promise.all(response.map((item) => item.json()));
    });
    console.log('quoteArray', quoteArray);

    const formatted = quoteArray.map((item) => {
      if (item.success) {
        const formatted = {
          author: item.contents.quotes[0].author,
          content: item.contents.quotes[0].quote,
        };
      } else {
      }
    });
  }
};
