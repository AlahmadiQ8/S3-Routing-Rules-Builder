import ConvertTxtToS3, { ConversionErrors } from '../lib';

describe('convertLine', function() {

  beforeEach( () => {
    this.txtToS3 = new ConvertTxtToS3();
  });

  it('throws error when line has less than two words', () => {
    // this.txtToS3.convertLine('oneWord').should.throw(new RegExp(ConversionErrors.LESS_THAN_2_WORDS));
    this.txtToS3.convertLine.bind(this.txtToS3, 'oneWord').should.throw(new RegExp(ConversionErrors.LESS_THAN_2_WORDS));
  });

  it('converts "docs/ image/" to the correct RoutingRule entry', () => {
    this.txtToS3.convertLine('docs/ image/');
    let exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>image/</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>`
    this.txtToS3.toString().should.be.eq(exptected);
  });

})


describe('toString', function() {

  beforeEach( () => {
    this.txtToS3 = new ConvertTxtToS3();
  });

  it('does not produce any xml for empty line', () => {
    this.txtToS3.convertLine();
    this.txtToS3.toString().should.be.empty;
  });

  it('produces correctly formated redirect rules given two lines', () => {
    this.txtToS3.convertLine('docs/ image/');
    this.txtToS3.convertLine('blog/ page/');
    let exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>image/</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>blog/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>page/</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>`
    this.txtToS3.toString().should.be.eq(exptected);
  })

})