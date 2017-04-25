

/*SERVER*/
var http                = require("http"),
    fs                  = require("fs"),
    url                 = require("url"),
    server_port         = process.env['OPENSHIFT_NODEJS_PORT'] || 3004,
    server_ip_address   = process.env['OPENSHIFT_NODEJS_IP']   || '127.0.0.1';

function start() {
    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;

        request['setEncoding']("utf8");

        request.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });

        request.addListener("end", function () {
            pathname = decodeURI(pathname);
            console.info('pathname - ',pathname);

            if(pathname === '/'){

                fs.readdir('video/', function(err, list) {
                    var items = '',
                        beginStr =  '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Видео Плеер</title>' +
                                    '<link rel="SHORTCUT ICON" href="/favicon.png" type="image/x-icon">' +
                                    '<link rel="stylesheet" type="text/css" href="styles.css">' +
                                    '<script src="./uppod.js" type="text/javascript"></script></head><body>',
                        endStr = '</script></html>',
                        divItems = [],
                        playerItems = [];

                    list.forEach(function(val, key){
                        var name = val.slice(0, -4),
                            id = 'video_' + key;
                        divItems.push('<div class="video_wrapper"><span>' + name + '</span><div class="player" id="' + id + '" style="width: 670px"></div></div>');
                        playerItems.push('var ' + id + ' = new Uppod({' +
                                            'm:"video",' +
                                            'uid:"' + id + '",' +
                                            'file:"' + val + '",' +
                                            'comment:"' + name + '"});'
                                            );

                        items += '{comment: "' + val + '", file: "' + val + '"},';
                    });


                    res = beginStr + divItems.join('<br>') + '<script type="text/javascript">' + playerItems.join('') + endStr;
                    response['writeHead'](200, {'Content-Type': 'text/html'});
                    response.end(res);

                });





            }else if(pathname.indexOf('.js') !== -1){
                res = fs.readFileSync('.' + pathname);

                response['writeHead'](200, {'Content-Type': 'application/javascript'});
                response.end(res);

            }else if(pathname.indexOf('.css') !== -1){
                res = fs.readFileSync('.' + pathname);
                response['writeHead'](200, {'Content-Type': 'text/css'});
                response.end(res);


            }else if(pathname.indexOf('.png') !== -1){
                res = fs.readFileSync('.' + pathname);
                response['writeHead'](200, {'Content-Type': 'image/png'});
                response.end(res);


            }else if(pathname.indexOf('.jpg') !== -1){
                res = fs.readFileSync('.' + pathname);
                response['writeHead'](200, {'Content-Type': 'image/jpeg'});
                response.end(res);


            }else if(pathname.indexOf('.mp4') !== -1){
                res = fs.readFileSync('video/' + pathname);
                response['writeHead'](200, {'Content-Type': 'video/mp4'});
                response.end(res);


            } else {
                response['writeHead'](404, {"Content-Type": "text/plain"});
                response.write("404 Not found");
                response.end();
            }
        });

    }

    var server = http.createServer(onRequest);
    server.listen(server_port, server_ip_address, function () {
        console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
    });


}

start();