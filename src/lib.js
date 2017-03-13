
import XMLWriter from 'xml-writer';

// <RoutingRules>
//   <RoutingRule>
//     <Condition>
//       <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals >
//     </Condition>
//     <Redirect>
//       <HostName>ec2-11-22-333-44.compute-1.amazonaws.com</HostName>
//       <ReplaceKeyPrefixWith>report-404/</ReplaceKeyPrefixWith>
//     </Redirect>
//   </RoutingRule>
// </RoutingRules>

export const ConversionErrors = {
  LESS_THAN_2_WORDS: 'line contains less than two words',
  WRONG_FORMAT: 'Cannot convert line'
}

export default class ConvertTxtToS3 {
  
  constructor() {
    this.xw = new XMLWriter(true);
    this.xw.startDocument();
    this.xw.startElement('RoutingRules');
    this.lines = 0;
  }

  convertLine(line='') {
    let trimmed = line.trim();
    if (!trimmed.length) {
      return; 
    }
    let [prefix, target, ...status] = trimmed.match(/\S+/g) || [];
    if (!prefix || !target) {
      // need to figure out a validation strategy. for not just return
      return;
      throw new Error(`${ConversionErrors.LESS_THAN_2_WORDS}: "${trimmed}"`);
    }
    this.xw.startElement('RoutingRule');
    this.xw.startElement('Condition');
    this.xw.writeElement('KeyPrefixEquals', prefix);
    this.xw.endElement();
    this.xw.startElement('Redirect');
    this.xw.writeElement('ReplaceKeyPrefixWith', target);
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