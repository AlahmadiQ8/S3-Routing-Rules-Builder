export class WordsIterator implements Iterable<number> {
  constructor(private doc: string) {}

  *[Symbol.iterator](): Iterator<number> {
    let offset = 0;
    while (offset < this.doc.length) {
      if (isWhiteSpace(this.doc[offset])) {
        offset += 1;
        continue;
      }
      yield offset;
      offset += wordLength(this.doc, offset) + 1;
    }
  }
}

function isWhiteSpace(str: string): boolean {
  return /\s/.test(str);
}

export function wordLength(doc: string, index: number): number {
  let start = index;
  while (index < doc.length && doc[index].match(/\S/)) {
    index++;
  }
  return index - start;
}
