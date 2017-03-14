import assign from 'lodash.assign';
import XMLWriter from 'xml-writer';


export const ConversionErrors = {
  EMPTY_LINE: 'line must not be empty',
  LESS_THAN_2_WORDS: 'line contains less than two words',
  WRONG_FORMAT: 'Cannot convert line',
  STATUS_NOT_NUMBER: 'status must be an integer'
};


export class UrlParser {
  
  constructor(url) {
    let parser = document.createElement('a');
    parser.href = url;
    let props = {
      protocol: parser.protocol.replace(/:/, ''),
      hostname: parser.hostname,
      pathname: parser.pathname
    }
    assign(this, props);
  }

  getHostname() {
    return this.hostname;
  }
  getProtocol() {
    return this.protocol;
  }
  getPathname() {
    return this.pathname;
  }

}


export default class ConvertTxtToS3 {
  
  constructor() {
    this.xw = new XMLWriter(true);
    this.xw.startDocument();
    this.xw.startElement('RoutingRules');
    this.lines = 0;
  }

  _parseLine(line) {
    let trimmed = line.trim();
    if (!trimmed.length) {
      throw new Error(`${ConversionErrors.EMPTY_LINE}: "${trimmed}"`);
    }
    let [prefix, target, ...status] = trimmed.match(/\S+/g) || [];
    if (status.length && isNaN(parseInt(status[0], 10))) {
      throw new Error(`${ConversionErrors.STATUS_NOT_NUMBER}: "${status[0]}"`);
    }
    if (!(prefix && target)) {
      throw new Error(`${ConversionErrors.LESS_THAN_2_WORDS}: "${trimmed}"`);
    }
    status = String(status);
    return {prefix, target, status};
  }

  convertLine(line='') {
    let {prefix, target, status} = this._parseLine(line);
    this.xw.startElement('RoutingRule');
    this.xw.startElement('Condition');
    this.xw.writeElement('KeyPrefixEquals', prefix);
    this.xw.endElement();
    this.xw.startElement('Redirect');

    if (/^http/.test(target)) {
      let temp = new UrlParser(target);
    }

    if (/.*\/$/.test(target)) { // if target ends with '/' char
      this.xw.writeElement('ReplaceKeyPrefixWith', target);  
    } else {
      this.xw.writeElement('ReplaceKeyWith', target);  
    }
    if (status) {
      this.xw.writeElement('HttpRedirectCode', status);    
    }

    this.xw.endElement();
    this.xw.endElement();
    this.lines += 1;
  }

  toString() {
    if (this.lines) {
      this.xw.endDocument();
      return this.xw.toString();
    }
    return '';
  }

}