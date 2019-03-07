import React from 'react';
import assign from 'lodash.assign';
import XMLWriter from 'xml-writer';



export const ConversionErrors = {
  EMPTY_LINE: 'line must not be empty',
  LESS_THAN_2_WORDS: 'line contains less than two words',
  WRONG_FORMAT: 'Wrong format',
  STATUS_NOT_NUMBER: 'status must be an integer'
};


export class UrlParser {
  
  constructor(url) {
    let parser = document.createElement('a');
    parser.href = url;
    let props = {
      protocol: parser.protocol.replace(/:/, ''),
      hostname: parser.hostname,
      pathname: parser.pathname.replace(/^\//,'')
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

export const VALID_LINE = /^\S+\s+\S+\s*(\d{3})*/g;

export default class ConvertTxtToS3 {
  
  constructor() {
    this.xw = new XMLWriter(true);
    this.xw.startDocument();
    this.xw.startElement('RoutingRules');
    this.lines = 0;
  }

  _parseLine(line) {
    if (line.match(VALID_LINE) == null) {
      throw new Error(`${ConversionErrors.WRONG_FORMAT}: "${line}"`)
    }
    let [prefix, target, ...status] = line.match(/\S+/g) || [];
    let parsedStatus = parseInt(status, 10);
    status = String(parsedStatus);
    return {prefix, target, status};
  }

  convertLine(line='') {
    let {prefix, target, status} = this._parseLine(line);
    this.xw.startElement('RoutingRule');
    this.xw.startElement('Condition');
    this.xw.writeElement('KeyPrefixEquals', prefix);
    this.xw.endElement();
    this.xw.startElement('Redirect');

    let path = target;
    if (/^http/.test(target)) {
      let urlParsed = new UrlParser(target);

      this.xw.writeElement('Protocol', urlParsed.getProtocol());
      this.xw.writeElement('HostName', urlParsed.getHostname());
      path = urlParsed.getPathname();
    }
    if (path) {
      if (/.*\/$/.test(path)) { // if path ends with '/' char
        this.xw.writeElement('ReplaceKeyPrefixWith', path);
      } else {
        this.xw.writeElement('ReplaceKeyWith', path);  
      }
    }
    if (!isNaN(status) && status.length === 3) {
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