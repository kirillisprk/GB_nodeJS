const colors = require("colors");

//Валидация введенных значений
const validationValues = (number1, number2) => {
    if (isNaN(number1)) {
        console.log(colors.red('Первое значение не число!'));
        return false;
    } else if (isNaN(number2)) {
        console.log(colors.red(' Второе значение не число!'));
        return false;
    } else if (number1 > number2) {
        console.log(colors.red('Невозможно создать интервал'), number1, ">", number2);
        return false;
    } else {
        console.log("Введенный диапазон", "с:", colors.green(number1), "по:", colors.green(number2));
        return true
    }

}

const creatArrayOfNumbersFromRange = (min, max) => {
    return Array.from(new Array((max - min) + 1),
        (val, index) => index + +min);
}

//Функция, которая возвращает true - если число простое, false - если не простое
const isPrimeNumber = num => {
    for (let i = 2; i < num; i++)
        if (num % i === 0) return false;
    return num > 1;
};

const output = (array) => {
    if (array.length !== 0) {
        for (let i = 0; i < array.length; i = i + 3) {
            console.log(colors.green(array[i]));
            if (i < array.length - 1)
                console.log(colors.yellow(array[i + 1]));
            if (i < array.length - 2)
                console.log(colors.red(array[i + 2]));
        }
    } else {
        console.log(colors.red("В диапазоне нет простых чисел"))
    }

}

const main = () => {
    //получение значений из консоли
    const [min, max] = process.argv.slice(2);
    if (validationValues(min, max)) {
        //Создаем массив чисел согласно введенному диапазону
        const arrayIntervalNumber = creatArrayOfNumbersFromRange(min, max);
        //Получаем массив с простыми числами
        const arrayPrimeNumber = arrayIntervalNumber.filter(number => isPrimeNumber(number));
        //Вывод массива
        output(arrayPrimeNumber);
    }
}

main();
