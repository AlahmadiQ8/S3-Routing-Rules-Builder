# Amazon S3 Routing Rules Builder

Inspired by [Netlify](https://www.netlify.com/docs/redirects/)'s redirect syntax, build [S3 conditional routing rules](http://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html#configure-bucket-as-website-routing-rule-syntax) using a simple space separated syntax. 

## Usage

Visit the [project Demo site](https://alahmadiq8.github.io/S3-Routing-Rules-Builder/) and paste 
your redirect rules in the text editor. Here is an example below: 

```text
/home              /
/blog/my-post.php  /blog/my-post  301
/news              /blog          200
/google            https://www.google.com
```

This will be transformed into the following: 

```xml
<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>/home</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>/</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>/blog/my-post.php</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyWith>/blog/my-post</ReplaceKeyWith>
            <HttpRedirectCode>301</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>/news</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyWith>/blog</ReplaceKeyWith>
            <HttpRedirectCode>200</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>/google</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>www.google.com</HostName>
        </Redirect>
    </RoutingRule>
</RoutingRules>
```

## Built With

* [React](https://facebook.github.io/react/)
* [Draftjs](https://draftjs.org/)
* [xml-writer](https://github.com/Inist-CNRS/node-xml-writer)
