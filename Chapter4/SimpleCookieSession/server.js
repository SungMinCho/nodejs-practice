const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')

const parseCookies = (cookie='') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k,...vs]) => [k, vs.join('=')])
        .reduce((acc, [k,v])=>{
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

const session = {}; // naive and unsafe way

http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        const sessionId = +new Date(); // random
        session[sessionId] = {name, expires};
        res.writeHead(302, {
            Location: "/",
            'Set-Cookie': `session=${sessionId};Expires=${expires.toGMTString()};HttpOnly;Path=/`,
        });
        res.end();
    } else if(cookies.session && session[cookies.session].expires > new Date()) {
        res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' });
        res.end(`Hello ${session[cookies.session].name}`);
    } else {
        fs.readFile('./server.html', (err, data) => {
            if(err) throw err;
            res.end(data);
        });
    }
})
.listen(8000, () => {
    console.log('listening at 8000');
})