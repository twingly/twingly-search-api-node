module.exports = exports = function(nock) {
var refs = [];

refs[0] = nock('http://api.twingly.com:443')
  .get('/blog/search/api/v3/search?apikey=wrong&q=something')
  .reply(401, "<?xml version=\"1.0\" encoding=\"utf-8\"?><error code=\"40101\"><message>Unauthorized</message></error>", { server: 'nginx',
  date: 'Mon, 16 Oct 2017 10:03:50 GMT',
  'content-type': 'application/xml; charset=utf-8',
  'content-length': '97',
  connection: 'close',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1' });


return refs;
};