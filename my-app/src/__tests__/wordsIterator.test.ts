import { WordsIterator } from "../wordsIterator";

function getResult(text: string): number[] {
  const result: number[] = [];
  const wordsIter = new WordsIterator(text);
  for (const offset of wordsIter) {
    result.push(offset);
  }
  return result;
}

describe("WordsIterator", () => {
  describe("iterates with indexes of the begining of every word in a given text with", () => {
    it("single space separated words", () => {
      const text = "omg yes lets test this";
      const expected = [0, 4, 8, 13, 18];

      expect(getResult(text)).toEqual(expected);
    });
    it("words with leading and trailing space", () => {
      const text = "   omg yes lets test this ";
      const expected = [3, 7, 11, 16, 21];
      expect(getResult(text)).toEqual(expected);
    });
    it("words varying number of spaces", () => {
      const text = " omg    yes  lets    test  this ";
      const expected = [1, 8, 13, 21, 27];
      expect(getResult(text)).toEqual(expected);
    });
    it("words containing / and *", () => {
      const text = "* omg y*s /lets/ /test this/";
      const expected = [0, 2, 6, 10, 17, 23];
      expect(getResult(text)).toEqual(expected);
    });
  });
});
