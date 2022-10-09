import React, {useState} from "react";
import './pit.css';

const TYPE_RES = {
    "IN_VALID": 'Invalid Input'
}

function checkInput(input) {
    if (input === null || input.length === 0) {
        return true;
    }
    return Number.isInteger(Number(input)) && parseInt(input) >= 0
}

const addCommas = (nStr) => {
    if (nStr && nStr.length === 0 || nStr === null) {
        return false;
    }
    nStr += "";
    const x = nStr.split(".");
    let x1 = x[0];
    const x2 = x.length > 1 ? "." + x[1] : "";
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

const converStrNum = (str) => {
    if (str && str.length === 0 || str === null) {
        return null;
    }
    const x = str.split(",");
    let res = '';
    for (let i = 0; i < x.length; i++) {
        res = res + x[i];
    }
    return res;
}

const RATE = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
const RATE_LENGTH = [5000000, 5000000, 8000000, 14000000, 20000000, 28000000, Number.MAX_VALUE];
const BASE_PIT = 11000000;
const BASE_PERSON = 4400000;
const calcPit = (total, person = 0) => {
    const _total = parseInt(total);
    const _realTotal = _total - Number(person) * BASE_PERSON;
    let base = BASE_PIT;
    let i = 0;
    let result = 0;
    while (_realTotal > base) {
        const min = Math.min(_realTotal - base, RATE_LENGTH[i]);
        result += min * RATE[i];
        base+=RATE_LENGTH[i];
        if (i < RATE.length) {
            i++;
        }
        else {
            break;
        }
    }

    return result;
}

function Pit() {
    const [total, setTotal] = useState(null);
    const [person, setPerson] = useState(0);

    const handleOnChangeTotal = (e) => {
        const value = converStrNum(e.target.value)
        setTotal(value);
    }

    const handleOnChangePerson = (e) => {
        if (e.target.value && e.target.value.length === 0) {
            setPerson(null);
        }
        else {
            setPerson(e.target.value);
        }
    }

    const render = () => {
        const resValue = checkInput(total) && checkInput(person);
        const _total = addCommas(total);
        const _calcPIT = calcPit(total, person);
        const _person = addCommas(person);
        return (
            <table className={"table-style"}>
                <thead>
                <tr>
                    <td>Tổng thu nhập:</td>
                    <td><input type={"text"} value={_total || ''} onChange={(e) => handleOnChangeTotal(e)}/></td>
                </tr>
                <tr>
                    <td>Số người phụ thuộc:</td>
                    <td><input type={"number"} min={0} value={_person || ''} onChange={(e) => handleOnChangePerson(e)}/></td>
                </tr>
                <tr>
                    <td>Thuế TNCN phải nộp:</td>
                    <td>{resValue ? addCommas(_calcPIT) : TYPE_RES.IN_VALID}</td>
                </tr>
                </thead>
            </table>
        );
    }

    return render();
}

export default Pit;