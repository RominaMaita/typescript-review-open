import {Currency} from "./currency";

export class Money {
    private readonly _amount: number;
    private readonly _currency: Currency;

    constructor(amount: number, currency: Currency) {
        if(amount < 0) {
            throw new Error("Amount cannot be negative");
        }
        this._amount = amount;
        this._currency = currency;
    }

    public get amount(): number {return this._amount;}

    public get currency(): Currency {return this._currency;}

    public toString = (): string => `${this._currency.code}${this._amount.toFixed(2)}`;

    public format = (locale: string = 'en-US'): string =>
        this._currency.formatAmount(this.amount, locale);

    public add =(other: Money): Money => {
        if(this.currency.code !== other.currency.code) {
            throw new Error("Cannot add Mney with different currencies")
        }
        return new Money(this._amount + other._amount, this._currency)
    }

    public multiply =(factor: number): Money =>{
        if(factor < 0) {
            throw new Error("Amount cannot be negative");
        }
        return new Money(this._amount * factor, this._currency)
    }
}