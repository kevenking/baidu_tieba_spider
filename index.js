var tiebaSpider = require('./tiebaspider');

var startNum = 5500;
var topicNum = 6500;
//var topicNum = 475899;

for (var i = startNum; i < topicNum; i += 50) {
//    var theUrl = 'http://tieba.baidu.com/f?kw=%D6%D0%B9%FA%BA%C3%C9%F9%D2%F4&tp=0&pn=' + i;
    var theUrl = 'http://tieba.baidu.com/f?kw=%C8%E9%B4%CB%C3%D4%C8%CB&tp=0&pn=' + i;
    console.log(theUrl);

    tiebaSpider.spider(theUrl);
}



