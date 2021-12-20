const fs = require("fs");
const rl = require('readline');
const ipRegex = require('ip-regex');
//const LOG_FILE = './file/test.log'
const LOG_FILE = './file/access.log'
const FILTER_IP_LIST = ['89.123.1.41', '34.48.240.111'];

const crl = rl.createInterface({
    input: fs.createReadStream(LOG_FILE),
    output: fs.createWriteStream('./file/output.log', {flags: 'a', encoding: 'utf8'})
});

crl.on('line', (line) => {
    const ipLine = line.match(ipRegex());
    if (line && FILTER_IP_LIST.some(e => ipLine.includes(e))) {
        crl.output.write(line);
        crl.output.write('\n');
    }
}).on('close', () => {
    console.log('Finished');
    process.exit(0);
});



