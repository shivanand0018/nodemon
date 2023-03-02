const fs = require('fs');
const requestHandler = (req, res) => {
    const url = req.url;
    if (url === "/") {
        const data = fs.readFileSync('file.txt', 'utf-8')
        console.log(data);
        res.write(`<html><head><h3>${data}</h3></head></html>`)
        res.write('<html><body><form action="/message" method="POST"><label>Type the Message</label><input type="text" name="message"></input><button type="submit">Submit</button><form></body></html>')
        return res.end();
    }
    if (url === "/message") {
        const body = []
        req.on('data', (chunk) => {
            body.push(chunk);
        })
        req.on('end', () => {
            const parsed = Buffer.concat(body).toString()
            const message = parsed.split('=')[1];
            console.log(message);
            fs.writeFileSync('file.txt', message);
            res.statusCode = 302;
            res.setHeader("Location", "/")
            return res.end();
        })
    }
}

module.exports.handler=requestHandler;