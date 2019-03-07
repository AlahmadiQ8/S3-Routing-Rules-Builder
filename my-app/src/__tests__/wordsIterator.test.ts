import { WordsIterator, WordResult } from '../wordsIterator';

function getResult(text: string): WordResult[] {
  const result: WordResult[] = [];
  const wordsIter = new WordsIterator(text);
  for (const { word, index } of wordsIter) {
    result.push({ word, index });
  }
  return result;
}

describe('WordsIterator', () => {
  describe('iterates with indexes of the begining of every word in a given text with', () => {
    it('single space separated words', () => {
      const text = 'omg yes lets test this';
      const expected = [
        {
          index: 0,
          word: 'omg'
        },
        {
          index: 4,
          word: 'yes'
        },
        {
          index: 8,
          word: 'lets'
        },
        {
          index: 13,
          word: 'test'
        },
        {
          index: 18,
          word: 'this'
        }
      ];
      expect(getResult(text)).toEqual(expected);
    });
    it('words with leading and trailing space', () => {
      const text = '   omg yes lets test this ';
      const expected = [
        {
          index: 3,
          word: 'omg'
        },
        {
          index: 7,
          word: 'yes'
        },
        {
          index: 11,
          word: 'lets'
        },
        {
          index: 16,
          word: 'test'
        },
        {
          index: 21,
          word: 'this'
        }
      ];
      expect(getResult(text)).toEqual(expected);
    });
    it('words varying number of spaces', () => {
      const text = ' omg    yes  lets    test  this ';
      const expected = [
        {
          index: 1,
          word: 'omg'
        },
        {
          index: 8,
          word: 'yes'
        },
        {
          index: 13,
          word: 'lets'
        },
        {
          index: 21,
          word: 'test'
        },
        {
          index: 27,
          word: 'this'
        }
      ];
      expect(getResult(text)).toEqual(expected);
    });
    it('words containing / and *', () => {
      const text = '* omg y*s /lets/ /test this/';
      const expected = [
        {
          index: 0,
          word: '*'
        },
        {
          index: 2,
          word: 'omg'
        },
        {
          index: 6,
          word: 'y*s'
        },
        {
          index: 10,
          word: '/lets/'
        },
        {
          index: 17,
          word: '/test'
        },
        {
          index: 23,
          word: 'this/'
        }
      ];
      expect(getResult(text)).toEqual(expected);
    });
  });
});
