import {Money} from "../../../shared/domain/model/money";
import { v4 as uuidv4 } from "uuid";

export class Customer {
    private readonly _id: string;
    private readonly _name: string;
    private _lastOrderPrice: Money | null;

    constructor(name: string) {
        if (!name || name.trim() === '') {
            throw new Error('Name cannot be empty');
        }
        this._id = uuidv4();
        this._name = name.trim();
        this._lastOrderPrice = null;
    }
    public get id(): string { return this._id; }

    public get name(): string { return this._name; }

    public get lastOrderPrice(): Money | null { return this._lastOrderPrice; }

    public set lastOrderPrice(newLastOrderPrice: Money) {
        this._lastOrderPrice = newLastOrderPrice;
    }

}