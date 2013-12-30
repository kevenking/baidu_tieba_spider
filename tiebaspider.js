var http = require('http');
var nodegrass = require('nodegrass');
var url = require('url');
var cheerio = require('cheerio');
var fs = require('fs');
var mkdirp = require('mkdirp');

var picDir = '/Users/kevenking/Pictures/baidu_tieba/';
var folderPath = '';
var picNum = 0;

function spider(targetUrl){
    var d = require('domain').create();
    d.on('error',function(er){
        console.log('error in domain:' + er.message);
    });

    d.run(function(){
        console.log("enter spider...");
//    return;
        var requestOptions = url.parse(targetUrl);
        var kw = encodeURI(requestOptions.query.split('&')[0].split('=')[1]);

        nodegrass.get(targetUrl,function(data,status){
            if(status != 200){
                console.log('Failed to get content of page : ' + targetUrl);
                return;
            }

            var tids = [];
            var $ = cheerio.load(data);

            $("li[class='j_thread_list clearfix']").each(function(){
//            console.log($(this).find('a.j_th_tit')[0].attribs.href.split('/')[2]);
                if($(this).find("div[class='small_wrap j_small_wrap']:has(img)").length == 0){
//                console.log("no img");
                }else{
//                console.log("have img");
                    tids.push($(this).find('a.j_th_tit')[0].attribs.href.split('/')[2]);
                }
//            console.log("==================");
            });
//        console.log(tids);
//        process.exit();
//        var tids = ['2764384284','2488803563'];
            processDetailPage(tids,kw);

        },'gbk').on('error',function(e){
                console.log('error:' + e.message);
            }).on('uncaughtException',function(){
                console.log('uncaughtException', e.stack);
            });
    });

}

function processDetailPage(tids,kw){
    console.log("enter processDetailPage...");
    for(var i = 0;i < tids.length;i++){
        var photoUrl = 'http://tieba.baidu.com/photo/p?kw=' + kw + '&flux=1&tid=' + tids[i] + '&pn=1&see_lz=1';

        getPhotoPage(photoUrl);
    }
}

function getPhotoPage(photoUrl){
    console.log("enter getPhotoPage...");
    var regex = /\r\n\t\t\t\'title\' : \'(.*?)\',/;
    nodegrass.get(photoUrl,function(data,status){
//            process.exit();
        if(status != 200){
            console.log('Failed to get contents of page : ' + photoUrl);
            return;
        }

        var requestOptions = url.parse(photoUrl);
        var tid = requestOptions.query.split('&')[2].split('=')[1];

        if(regex.test(data)){
            title = encodeURI(RegExp.$1);
            guideUrl = 'http://tieba.baidu.com/photo/bw/picture/guide?kw=' + title + '&tid=' + tid + '&see_lz=1&from_page=0&alt=jview&next=15&prev=15&_=1387861316560';
            processGuidePage(guideUrl);
        }
    },'gbk').on('error',function(e){
            console.log('error:' + e.message);
        }).on('uncaughtException',function(){
            console.log('uncaughtException', e.stack);
        });
}

function processGuidePage(guideUrl) {
    console.log("enter processGuidePage...");

    nodegrass.get(guideUrl,function(data,status){
        if(status != 200){
            console.log('Failed to get contents of page : ' + guideUrl);
            return;
        }


        var json = eval('(' + data + ')');

        for(var item in json.data.pic_list){
            var imgUrl = json.data.pic_list[item].img.original.waterurl;

            folderPath = picDir+parseInt(picNum/200);
            console.log('picNum：'+picNum);
//            console.log(imgUrl);
//            console.log(folderPath);

            getImg(imgUrl,folderPath);
            picNum++;
        }
    },'gbk').on('error',function(e){
            console.log('error:' + e.message);
        }).on('uncaughtException',function(){
            console.log('uncaughtException', e.stack);
        });
}

function getImg(imgUrl,folderPath){
//    console.log("enter getImg...");
    var requestOptions = url.parse(imgUrl);
    var picPathArr = requestOptions.pathname.split('/');
    var picName = picPathArr[picPathArr.length-1];
//    console.log(picName);
//    console.log(folderPath);

    mkdirp(folderPath,function(err){
        if(err) console.error(err);
    });

    http.get(requestOptions, function(response){
        if(response.statusCode != 200){
            console.log("failed to get package form google");
            return;
        }

        response.pipe(fs.createWriteStream(folderPath + '/' + picName));
    }).on('error', function(e) {
            console.log("Got error<getting packages>: " + e.message);
        }).on('uncaughtException',function(){
            console.log('uncaughtException', e.stack);
        });
}

exports.spider = spider;