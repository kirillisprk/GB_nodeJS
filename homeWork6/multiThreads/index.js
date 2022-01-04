const worker_threads = require('worker_threads');

const searchInfile = (test) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads.Worker('./search.js', {
            workerData: test
        });
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}
(async () => {
    const param = {
        path: '/Users/kirill/Documents/SorceCode/GeekBrains/GB_nodeJS/homeWork4/file/test.log',
        kayWord: '176.212.24.22'
    };
    const resultSearch = await searchInfile(param);
})();

