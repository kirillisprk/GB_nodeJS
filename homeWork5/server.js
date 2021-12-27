const http = require('http');
const url = require("url");
const path = require("path");
const fs = require("fs");
const {promises: fsPromises} = require("fs");
const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

const checkPath = async (path, stat = false) => {
    return await fsPromises.stat(path)
        .then(res => {
            if (stat) {
                return res.size
            } else
                return res.isDirectory();
        })
        .catch(() => {
            if (stat) {
                return 'null'
            } else
                return false
        })
}
const showReadFile = (directory, response) => {
    const ext = path.parse(directory).ext;
    fs.readFile(directory, (err, data) => {
        if (err) {
            response.statusCode = 500;
            response.end(`Error getting the file: ${err}.`);
        } else {
            response.setHeader('Content-type', map[ext] || 'text/plain');
            response.end(data);
        }
    });
}
const showDirectory = async (path) => {
    const contentPath = fs.readdirSync(path);
    let contentPathObj = {};
    for (const element of contentPath) {
        contentPathObj[element] = {
            object: await checkPath(`${path}/${element}`) ? "folder" : "file",
            size: await checkPath(`${path}/${element}`, true)
        }
    }
    return JSON.stringify(contentPathObj, null, 2)
}
const main = async (path, response) => {
    const isDirectory = await checkPath(path);
    if (isDirectory) {
        showDirectory(path).then(res => {
            response.end(res)
        })

    } else {
        showReadFile(path, response)
    }

}
http.createServer((request, response) => {
    let directory = url.parse(request.url, true).pathname;
    if (request.method === 'GET' && directory !== '/favicon.ico') {
        main(directory, response)
    } else {
        response.end('Method Not Allowed');
    }
}).listen(3000, 'localhost');


