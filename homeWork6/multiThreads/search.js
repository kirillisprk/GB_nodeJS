const {workerData, parentPort} = require('worker_threads');
const rl = require('readline');
const fs = require('fs');

const search = ({path, kayWord}) => {
    const crl = rl.createInterface({
        input: fs.createReadStream(path),
    });
    let resultSearch = 0;
    crl.on('line', (line) => {
            if (line) {
                let match = line.toLowerCase().includes(kayWord.toLowerCase());
                if (match) {
                    resultSearch++
                }
            }
        }
    ).on('close', () => {
        console.log('Найдено совпадений:', resultSearch);
        process.exit(0);
    });

};

parentPort.postMessage(search(workerData));




