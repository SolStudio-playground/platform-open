import numeral from 'numeral';

type InputValue = string | number | null;

export function fShortenNumber(number: InputValue): string {
    if (number === null || number === undefined) {
        return '';  // Return an empty string if the input is null or undefined
    }
    return numeral(number).format('0.0a');  // Using '0.0a' to avoid trailing zeros
}
