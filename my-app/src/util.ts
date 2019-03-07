import XMLWriter from 'xml-writer';

enum ConversionErrors {
  EMPTY_LINE = 'line must not be empty',
  LESS_THAN_2_WORDS = 'line contains less than two words',
  WRONG_FORMAT = 'Wrong format',
  STATUS_NOT_NUMBER = 'status must be an integer'
}

export const VALID_LINE = /^\S+\s+\S+\s*(\d{3})*/g;
export const ENDS_WITH_FORWARD_SLASH = /.*\/$/;

interface ParsedURL {
  protocol: string;
  hostname: string;
  pathname: string;
}

function parseUrl(url: string): ParsedURL {
  const parser = document.createElement('a');
  parser.href = url;
  return {
    protocol: parser.protocol.replace(/:/, ''),
    hostname: parser.hostname,
    pathname: parser.pathname.replace(/^\//, '')
  };
}

export class ConvertTxtToS3 {
  private xw: XMLWriter;
  private lines: number = 0;

  public constructor() {
    this.xw = new XMLWriter(true);
    this.xw.startElement('RoutingRules');
  }

  private _parseLine(line: string): ({ prefix: string; target: string; status: string}) {
    if (line.match(VALID_LINE) == null) {
      throw new Error(`${ConversionErrors.WRONG_FORMAT}: "${line}"`);
    }
    let [prefix, target, status] = line.match(/\S+/g) || ['', '', ''];
    return { prefix, target, status: String(parseInt(status, 10)) };
  }

  private _isValidStatusCode(status: string): boolean {
    return !isNaN((status as unknown) as number) && status.length === 3
  }

  public convertLine(line = ''): void {
    let { prefix, target, status } = this._parseLine(line);
    this.xw.startElement('RoutingRule');
    this.xw.startElement('Condition');
    this.xw.writeElement('KeyPrefixEquals', prefix);
    this.xw.endElement();
    this.xw.startElement('Redirect');

    let path;
    if (/^http/.test(target)) {
      const urlParsed = parseUrl(target);
      this.xw.writeElement('Protocol', urlParsed.protocol);
      this.xw.writeElement('HostName', urlParsed.hostname);
      path = urlParsed.pathname;
    } else {
      path = target;
    }

    if (ENDS_WITH_FORWARD_SLASH.test(path)) {
      this.xw.writeElement('ReplaceKeyPrefixWith', path);
    } else {
      this.xw.writeElement('ReplaceKeyWith', path);
    }
    if (this._isValidStatusCode(status)) {
      this.xw.writeElement('HttpRedirectCode', status);
    }

    this.xw.endElement();
    this.xw.endElement();
    this.lines += 1;
  }

  public toString(): string {
    if (this.lines) {
      this.xw.endDocument();
      return this.xw.toString();
    }
    return '';
  }
}
