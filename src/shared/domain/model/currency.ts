type UppercaseLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

export type CurrencyCode = `${UppercaseLetter}${UppercaseLetter}${UppercaseLetter}`;

export class Currency {
    private readonly _code: CurrencyCode;

    constructor(code: CurrencyCode) {
        this._code = code;
    }

    public get code(): string {
        return this._code;
    }

    public formatAmount = (amount: number, locale = 'en-US'): string => {
        return amount.toLocaleString(locale, {
            style: 'currency',
            currency: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };


    public toString = (): string => this.code
}

