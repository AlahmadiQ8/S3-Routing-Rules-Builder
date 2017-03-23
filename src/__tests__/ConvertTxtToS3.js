import ConvertTxtToS3, { ConversionErrors } from '../lib';



describe('_parseLine', function() {

  beforeEach( () => {
    this.txtToS3 = new ConvertTxtToS3();
  });

  it('throws error when line has less than two words', () => {
    this.txtToS3._parseLine.bind(this.txtToS3, 'oneWord').should.throw(new RegExp('Wrong format'));
  });

  it('throws error given empty line', () => {
    this.txtToS3._parseLine.bind(this.txtToS3, '').should.throw(new RegExp('Wrong format'));
  });

  it('returns object with three properties of string type given three words', () => {
    let {prefix, target, status} = this.txtToS3._parseLine('test test 212');
    prefix.should.be.a('string');
    target.should.be.a('string');
    status.should.be.a('string');
  })

})


describe('convertLine', function() {

  beforeEach( () => {
    this.txtToS3 = new ConvertTxtToS3();
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

  it('converts "docs/ image" to the correct RoutingRule entry', () => {
    this.txtToS3.convertLine('docs/ image');
    let exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyWith>image</ReplaceKeyWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>`
    this.txtToS3.toString().should.be.eq(exptected);
  });

  it('converts "docs/ image 301" to the correct RoutingRule entry', () => {
    this.txtToS3.convertLine('docs/ image 301');
    let exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyWith>image</ReplaceKeyWith>
            <HttpRedirectCode>301</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
</RoutingRules>`
    this.txtToS3.toString().should.be.eq(exptected);
  });

  it('converts "docs/ https://github.com/AlahmadiQ8/ 301" to the correct RoutingRule entry', () => {
    this.txtToS3.convertLine('docs/ https://github.com/AlahmadiQ8/ 301');
    let exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>github.com</HostName>
            <ReplaceKeyPrefixWith>AlahmadiQ8/</ReplaceKeyPrefixWith>
            <HttpRedirectCode>301</HttpRedirectCode>
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

  it('produces correctly formated redirect rules given three lines', () => {
    this.txtToS3.convertLine('docs/ image/');
    this.txtToS3.convertLine('blog/ page');
    this.txtToS3.convertLine('docs/ image/ 200');
    this.txtToS3.convertLine('docs/ https://github.com/AlahmadiQ8/ 301');
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
            <ReplaceKeyWith>page</ReplaceKeyWith>
        </Redirect>
    </RoutingRule>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>image/</ReplaceKeyPrefixWith>
            <HttpRedirectCode>200</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>github.com</HostName>
            <ReplaceKeyPrefixWith>AlahmadiQ8/</ReplaceKeyPrefixWith>
            <HttpRedirectCode>301</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
</RoutingRules>`
    this.txtToS3.toString().should.be.eq(exptected);
  })

})