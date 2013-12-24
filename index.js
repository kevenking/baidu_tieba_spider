/**
 * Created with IntelliJ IDEA.
 * User: kevenking
 * Date: 13-12-24
 * Time: 上午11:11
 * To change this template use File | Settings | File Templates.
 */

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



