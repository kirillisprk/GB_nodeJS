/*Напишите программу, которая будет принимать на вход несколько
аргументов: дату и время в формате «час-день-месяц-год».
Задача программы — создавать для каждого аргумента таймер с обратным
отсчётом: посекундный вывод в терминал состояния таймеров (сколько осталось).
По истечении какого-либо таймера, вместо сообщения о том, сколько осталось,
    требуется показать сообщение о завершении его работы.
    Важно, чтобы работа программы основывалась на событиях.*/

const colors = require("colors");
const EventEmitter = require('events');
const {Settings, Duration} = require("luxon");
Settings.defaultLocale = "ru";

const emitter = new EventEmitter();

class Timer {
    constructor (seconds = 0, minutes = 0, hours = 0, days = 0, months = 0, years = 0) {
        this.seconds = +seconds;
        this.minutes = +minutes;
        this.hours = +hours;
        this.days = +days;
        this.months = +months;
        this.years = +years;
    }
}

const arg = process.argv.slice(2);

const createTimer = () => {
    let arrayTimer = [];
    for (let i = 0; i < arg.length; i++) {
        let splits = arg[i].split('-', 6).filter((el) => Number.isInteger(+el));
        if (splits.length === 0) {
            console.log(colors.red(`Не удалось создать таймер для параметров: ${arg[i]}`))
        } else {
            let timer = new Timer(...splits);
            timer.millis = Duration.fromObject(timer).toMillis();
            timer.numberTimer = i + 1;
            let format = Duration.fromObject({milliseconds: timer.millis}).toFormat('dd.MM.yy, hh:mm:ss');
            console.log(colors.green(`Создаем таймер ${timer.numberTimer} на:`), format);
            arrayTimer.push(timer);
        }
    }
    return arrayTimer
}

const decTimer = (number) => {
    if (arrayTimer[number].millis !== 1000) {
        arrayTimer[number].millis = arrayTimer[number].millis - 1000;
        let format = Duration.fromObject({milliseconds: arrayTimer[number].millis}).toFormat('dd.MM.yy, hh:mm:ss');
        console.log(colors.yellow(`Осталось времени у ${arrayTimer[number].numberTimer} таймера: ${format}`));
    } else {
        console.log(colors.green(`таймер ${arrayTimer[number].numberTimer} завершён`));
        emitter.removeListener(`${arrayTimer[number].numberTimer}`, decTimer);
        arrayTimer.splice(number, 1);

    }

}

//генерация событий
const generateEmitEmitter = (array) => {
    for (let i = 0; i < array.length; i++) {
        emitter.emit(`${array[i].numberTimer}`, i);
    }
}
//Подписка на событий
const createOnEmitter = (array) => {
    for (let i = 0; i < array.length; i++) {
        emitter.on(`${array[i].numberTimer}`, decTimer);
        console.log(`создали подписку на ${array[i].numberTimer} таймер`)
    }
}

const run = async () => {
    const delay = 1000;
    generateEmitEmitter(arrayTimer);
    await new Promise(resolve => setTimeout(resolve, delay));
    if (arrayTimer.length) {
        await run();
    } else {
        console.log(colors.green("Все таймеры завершены"))
    }

}

let arrayTimer = createTimer();
createOnEmitter(arrayTimer);
run();





