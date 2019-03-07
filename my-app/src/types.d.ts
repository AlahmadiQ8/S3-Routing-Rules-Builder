declare module '*';

declare module 'xml-writer' {
  type Indent = boolean | string;

  class XMLWriter {
    constructor(indent?: Indent);

    startElement(element: string | (() => string)): XMLWriter;
    endElement(): XMLWriter;

    startDocument(
      version?: string = '1.0',
      encoding?: string = null,
      standalone?: boolean = false
    ): XMLWriter;

    writeElement(name: string, content: string): XMLWriter;

    endDocument(): XMLWriter;

    toString(): string;
  }

  export = XMLWriter;
}
