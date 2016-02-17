# Twingly Search API Node

[![Build Status](https://travis-ci.org/twingly/twingly-search-api-node.png?branch=master)](https://travis-ci.org/twingly/twingly-search-api-node)

A Node.js library for Twingly's Search API (previously known as Analytics API). Twingly is a blog search service that provides a searchable API known as [Twingly Search API](https://developer.twingly.com/resources/search/).

## Installation

Install npm

```shell
npm install --save twingly-search
```

## Usage

```javascript
var Client = require('twingly-search').Client;

var client = new Client();
var query = client.query();
query.pattern = 'github page-size:10';
query.language = 'sv';
query.execute(function(error, result){
    if (error != false) {
        console.error(error);
    } else {
        for(var i = 0; i < result.posts.length; i++) {
            console.log(result.posts[i].url);
        }
    }
});
```

The `twingly-search` library talks to a commercial blog search API and requires an API key. Best practice is to set the `TWINGLY_SEARCH_KEY` environment variable to the obtained key. `Client` can be passed a key at initialization if your setup does not allow environment variables.

Library is documented with [jsdoc](http://usejsdoc.org/). To generate documentation run next command

```shell
node_modules/.bin/jsdoc -r ./lib
```

Example code can be found in [examples/](examples/).

To learn more about the capabilities of the API, please read the [Twingly Search API documentation](https://developer.twingly.com/resources/search/).

## Requirements

* API key, contact sales@twingly.com via [twingly.com](https://www.twingly.com/try-for-free/) to get one
* Node.js
  * Node.js 0.12, Node.js 4, Node.js 5
  * [xmldom](https://www.npmjs.com/package/xmldom)
  * [xpath](https://www.npmjs.com/package/xpath)

## Release

Bump the version in [package.json](./package.json).

Publish to [npm]:

```shell
npm publish
```

### Testing

To run all tests simply execute

```shell
npm test
```

and particular test case

```shell
# Unix
npm test test/test_client

# Windows
npm test test\test_client

```

[npm]: https://npmjs.com

## License

The MIT License (MIT)

Copyright (c) 2016 Twingly AB

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
