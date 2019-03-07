const isWhiteSpace = (str: string): boolean => /\s/.test(str);

const getWord = (doc: string, index: number): string => {
  let word = '';
  while (index < doc.length && doc[index].match(/\S/)) {
    word += doc[index++];
  }
  return word;
};

export interface WordResult {
  index: number;
  word: string;
}

export class WordsIterator implements Iterable<WordResult> {
  private doc: string;

  public constructor(doc: string) {
    this.doc = doc;
  }

  public *[Symbol.iterator](): Iterator<WordResult> {
    let index = 0;
    while (index < this.doc.length) {
      if (isWhiteSpace(this.doc[index])) {
        index += 1;
        continue;
      }
      const word = getWord(this.doc, index);
      yield { index, word };
      index += word.length + 1;
    }
  }
}
