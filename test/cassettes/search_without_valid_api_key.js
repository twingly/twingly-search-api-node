module.exports = exports = function(nock) {
var refs = [];

refs[0] = nock('http://api.twingly.com:443')
  .get('/analytics/Analytics.ashx?key=wrong&searchpattern=something&documentlang=&ts=&tsTo=&xmloutputversion=2')
  .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><blogstream xmlns=\"http://www.twingly.com\">\r\n  <operationResult resultType=\"failure\">The API key does not exist.</operationResult>\r\n</blogstream>", { server: 'nginx',
  date: 'Wed, 10 Feb 2016 23:37:40 GMT',
  'content-type': 'text/xml; charset=utf-8',
  'content-length': '183',
  connection: 'close',
  'cache-control': 'private',
  'set-cookie': [ 'SERVERID=web03; path=/' ] });


return refs;
};
