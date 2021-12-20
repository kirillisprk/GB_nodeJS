const fs = require("fs");
const rl = require('readline');
const ipRegex = require('ip-regex');
const LOG_FILE = './file/test.log'
//const LOG_FILE = './file/access.log'
const FILTER_IP_LIST = ['89.123.1.41', '34.48.240.111'];

const crl = rl.createInterface({
    input: fs.createReadStream(LOG_FILE),
});

let arrayWriter = [];

createWriteStream = (ip) => {
    return fs.createWriteStream(`./file/${ip}_requests.log`, {
        encoding: 'utf8',
        flag: 'a'
    })
}

FILTER_IP_LIST.forEach((element) => {
    arrayWriter.push(createWriteStream(element));
});

crl.on('line', (line) => {
        const ipLine = line.match(ipRegex());
        if (line) {
            switch (ipLine[0]) {
                case FILTER_IP_LIST[0]: {
                    arrayWriter[0].write(line + '\n');
                    break;
                }
                case FILTER_IP_LIST[1]: {
                    arrayWriter[1].write(line + '\n');
                    break;
                }
                default: {
                    break;
                }

            }

        }
    }
).on('close', () => {
    console.log('Finished');
    process.exit(0);
});


