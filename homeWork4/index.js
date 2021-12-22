#!/usr/bin/env node
const fs = require("fs");
const inquirer = require("inquirer");
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt');
const rl = require("readline");
const arg = process.argv.slice(2);
let currentDirectory = '';
const fsPromises = require("fs").promises;

const isFile = (fileName) => {
    return fs.lstatSync(fileName).isFile();
};

const searchInfile = (fileName, keyword) => {
    const crl = rl.createInterface({
        input: fs.createReadStream(fileName),
    });
    let resultSearch = 0;
    crl.on('line', (line) => {
            if (line) {
                let match = line.toLowerCase().includes(keyword.toLowerCase());
                if (match) {
                    resultSearch++
                }
            }
        }
    ).on('close', () => {
        console.log('Найдено совподений:', resultSearch)
        process.exit(0);
    });
};

const cli = (directory) => {
    console.log('Текущая директория:', directory);
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
    inquirer
        .prompt([
            {
                name: 'fileName',
                type: 'file-tree-selection',
                message: 'Выберите файл:',
                root: directory,
                validate: (item) => {
                    if (!isFile(item)) {
                        return `please select another file ${isFile(item)}`
                    }
                    return true;
                },

            },
            {
                name: 'keyword',
                type: 'input',
                message: 'Введите слово или фарзу для поиска:'
            }
        ])
        .then((answer) => {
            console.log("В файле:", answer.fileName)
            searchInfile(answer.fileName, answer.keyword);
        });
}

const checkPath = async () => {
    return await fsPromises.stat(arg[0])
}

checkPath().then((res) => {
    if (res.isDirectory()) {
        currentDirectory = arg[0];
        cli(currentDirectory);
    } else {
        currentDirectory = process.cwd();
        cli(currentDirectory);
    }
}).catch(
    () => {
        currentDirectory = process.cwd();
        cli(currentDirectory);
    }
);


