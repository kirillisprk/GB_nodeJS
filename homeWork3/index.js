const fs = require("fs");
const rl = require('readline');
const ipRegex = require('ip-regex');
const LOG_FILE = './file/test.log'
//const LOG_FILE = './file/access.log'
const FILTER_IP_LIST = ['89.123.1.41', '34.48.240.111'];

const crl = rl.createInterface({
    input: fs.createReadStream(LOG_FILE),
});

let objWriter = [];

createWriteStream = (name) => {
    return fs.createWriteStream(`./file/${name}_requests.log`, {
        encoding: 'utf8',
        flag: 'a'
    })
}

FILTER_IP_LIST.forEach((element) => {
    objWriter[element] = createWriteStream(element);
});

crl.on('line', (line) => {
        const ipLine = line.match(ipRegex());
        if (line) {
            FILTER_IP_LIST.forEach((element => {
                if (ipLine.includes(element)) {
                    objWriter[element].write(line + '\n');
                }
            }))
        }
    }
).on('close', () => {
    console.log('Finished');
    process.exit(0);
});

