var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stripJsonComments = require('strip-json-comments');
var fs = require('fs');
var debug = require('debug')('blog');
var path = require('path');
var request = require('request');

var options = {
    port: 8080,
    host: '192.168.7.109',
    headers: {
        'content-type': 'application/json'
    }
};

var app = express();
var env     = process.env.NODE_ENV || 'development';
app.set('port', process.env.PORT || 3000);
var sp1 = path.resolve(__dirname, '../app'),
    sp2 = path.resolve(__dirname, '../.tmp'),
    langUrl = path.resolve(__dirname, '../app/languages/');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/languages/', function(req, res) {
    var tmp = path.join(langUrl, req.url);
    fs.readFile(tmp , {encoding: 'utf8'}, function(err, data) {
        return res.type('json').end(stripJsonComments(data));
    });
});
app.use(express.static(sp1));
app.use(express.static(sp2));

app.post('/account/login', function(req, res) {
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.post('/account/logout', function(req, res) {
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});

app.get('/agent/list', function(req, res) {
    var id = req.query.id,
        start = req.query.start,
        length = req.query.length;
    console.log('http://192.168.7.109:8080' + req.url)
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
});

app.post('/agent/add', function(req, res) {
    console.log(req.body);
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.post('/agent/edit', function(req, res) {
    console.log(req.body);
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.post('/agent/delete', function(req, res) {
    console.log(req.body);
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});

app.get('/agent/info', function(req, res) {
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
});

app.get('/agent/existUser', function(req, res) {
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
});


app.post('/merchant/add', function(req, res) {
    console.log(req.body);
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.get('/merchant/info', function(req, res) {
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.post('/merchant/edit', function(req, res) {
    console.log(req.body);
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.post('/merchant/delete', function(req, res) {
    console.log(req.body);
    request.post({
        url: 'http://192.168.7.109:8080' + req.url,
        form: req.body
    }, function(err, response, body) {
        res.type('json').end(body);
    });
});
app.get('/merchant/tree', function(req, res) {
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
    //res.type('json').end('{"status": 1000, "msg": "", "data": [{"list": [{"flag": "shop", "list": [], "id": 1, "name": "\u4e00\u53f7\u5e97"}, {"flag": "agent", "list": [{"flag": "agent", "list": [], "id": 4, "name": "B1000\u6e20\u9053"}, {"flag": "agent", "list": [], "id": 5, "name": "B20000\u5b50\u6e20\u9053"}], "id": 2, "name": "B--\u6e20\u9053"}, {"flag": "agent", "list": [{"flag": "agent", "list": [], "id": 6, "name": "A\u7684\u5b50\u6e20\u9053\uff0c\u540d\u5b57\u957f\u4e00\u70b9"}, {"flag": "agent", "list": [], "id": 7, "name": "A\u7684\u5b50\u6e20\u9053\uff0c\u540d\u5b57\u66f4\u957f\u4e00\u70b9\uff0c\u957f\u4e00\u70b9"}], "id": 3, "name": "A-------\u6e20\u9053"}], "id": 1, "name": "Mcdonalds"}]}');
});

app.get('/merchant/existUser', function(req, res) {
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
});

app.get('/api/industries', function(req, res) {
    var id = req.query.parentId;
    console.log('http://192.168.7.109:8080' + req.url);
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        console.log(body);
        res.type('json').end(body);
    });
});

app.get('/api/region', function(req, res) {
    var id = req.query.parentId;
    console.log('http://192.168.7.109:8080' + req.url);
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        console.log(body);
        res.type('json').end(body);
    });
});


app.get('/merchant/list', function(req, res) {
    console.log('http://192.168.7.109:8080' + req.url)
    request('http://192.168.7.109:8080' + req.url, function(err, response, body) {
        res.type('json').end(body);
    });
});

module.exports = app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});