let cookie = require('cookie');
let escapeHtml = require('escape-html');
let http = require('http');
let url = require('url');

let server = http.createServer((req, res) => {
    let query = url.parse(req.url, true, true).query;
    if (query && query.remember && query.name) {
        res.setHeader('Set-Cookie', cookie.serialize('name', String(query.name), {
            httpOnly: true,
            maxAge: 10
        }));
        res.statusCode = 302;
        res.setHeader('Location', req.headers.referer || '/');
        res.end();
        return;
    }
    let cookies = cookie.parse(req.headers.cookie || '');
    let name = cookies.name;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    if (name) {
        res.write('<form method="GET">');
        res.write('<p>Welcome back, <b>' + escapeHtml(name) + '</b>!</p>');
        res.write('<input placeholder="enter your name" name="name" value="' + escapeHtml(name) + '"> <input type="submit" value="Set Name">');
        res.end('</form>');
    } else {
        res.write('<form method="GET">');
        res.write('<p>Hello, new visitor!</p>');
        res.write('<input placeholder="enter your name" name="name" value=""> <input type="submit" value="Set Name">');
        res.end('</form>');
    }
});

server.listen(8080, () => {
    console.log('http://localhost:8080');
});