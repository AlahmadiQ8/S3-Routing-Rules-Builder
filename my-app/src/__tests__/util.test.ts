import { ConvertTxtToS3 } from '../util';

let txtToS3: ConvertTxtToS3;

beforeEach(() => {
  txtToS3 = new ConvertTxtToS3();
});

describe('ConvertTxtToS3.convertLine()', () => {
  it('throws error when line has less than two words', () => {
    expect(() => {
      txtToS3.convertLine('oneworf');
    }).toThrow();
  });
  it('throws error given empty line', () => {
    expect(() => {
      txtToS3.convertLine('');
    }).toThrow();
  });

  it('converts "docs/ image/" to the correct RoutingRule entry', () => {
    txtToS3.convertLine('docs/ image/');
    const exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>image/</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>`;
    expect(txtToS3.toString()).toBe(exptected);
  });

  it('converts "docs/ image" to the correct RoutingRule entry', () => {
    txtToS3.convertLine('docs/ image');
    const exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyWith>image</ReplaceKeyWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>`;
    expect(txtToS3.toString()).toBe(exptected);
  });

  it('converts "docs/ image 301" to the correct RoutingRule entry', () => {
    txtToS3.convertLine('docs/ image 301');
    const exptected = `<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>docs/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyWith>image</ReplaceKeyWith>
            <HttpRedirectCode>301</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
</RoutingRules>`;
    expect(txtToS3.toString()).toBe(exptected);
  });

  it('converts "docs/ https://github.com/AlahmadiQ8/ 301" to the correct RoutingRule entry', () => {
    txtToS3.convertLine('docs/ https://github.com/AlahmadiQ8/ 301');
    const exptected = `<RoutingRules>
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
</RoutingRules>`;
    expect(txtToS3.toString()).toBe(exptected);
  });
});

describe('ConvertTxtToS3.toString()', () => {
  it('produces correctly formated redirect rules given three lines', () => {
    txtToS3.convertLine('docs/ image/');
    txtToS3.convertLine('blog/ page');
    txtToS3.convertLine('docs/ image/ 200');
    txtToS3.convertLine('docs/ https://github.com/AlahmadiQ8/ 301');
    const exptected = `<RoutingRules>
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
</RoutingRules>`;
    expect(txtToS3.toString()).toBe(exptected);
  });
});
