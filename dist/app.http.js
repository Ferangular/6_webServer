import fs from 'fs';
import http from 'http';
const server = http.createServer((req, res) => {
    console.log(req.url);
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write(`<h1>URL ${ req.url }</h1>`);
    // res.end();
    // const data = { name: 'John Doe', age: 30, city: 'New York' };
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end( JSON.stringify(data) );
    if (req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlFile);
        return;
    }
    if (req.url?.endsWith('.js')) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
    }
    else if (req.url?.endsWith('.css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
    }
    try {
        const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8');
        res.end(responseContent);
    }
    catch (error) {
        console.log(`File not found: ./public${req.url}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
    }
});
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
//# sourceMappingURL=app.http.js.map