import {DateTime} from "../../../shared/domain/model/date-time";
import {SalesOrderItem} from "./sales-order-item";
import {Currency} from "../../../shared/domain/model/currency";
import { v4 as uuidv4 } from 'uuid';
import {Money} from "../../../shared/domain/model/money";

export type SalesOrderState = "PENDING" | "CONFIRM" | "SHIPPED" | "CANCELLED"

export class SalesOrder{
    private readonly _customerId: string;
    private readonly _id: string;
    private readonly _items: SalesOrderItem[];
    private readonly _orderAt: DateTime;
    private readonly _currency: Currency;
    private _state: SalesOrderState;

    constructor(customerId: string, currency: Currency,
                orderAt?: Date | string) {
        if (!customerId || customerId.trim() === "") {
            throw new Error("customer id is required");
        }
        this._id = uuidv4();
        this._customerId = customerId;
        this._currency = currency;
        this._items = [];
        this._orderAt = new DateTime(orderAt);
        this._state = "PENDING";
    }

    public get id(): string { return this._id; }
    public get customerId(): string { return this._customerId; }
    public get orderAt(): DateTime { return this._orderAt; }
    public get state(): string { return this._state; }
    public get currency(): Currency { return this._currency; }

    public addItem(productId: string, quantity: number, unitPriceAmount: number): void {
        if(productId || productId.trim() === "") {
            throw new Error("product id is required");
        }

        if(quantity <= 0) {
            throw new Error("quantity is required");
        }
        //TODO: if (!this.canAddItems())
        if(!this.canAddItems()){
            throw new Error(`Cannot add items to order in state ${this._state}`);
        }

        const unitPrice = new Money(unitPriceAmount, this._currency);
        const item = new SalesOrderItem(this._id, productId.trim(), quantity, unitPrice);
        this._items.push(item);
    }

    public calculateTotalPrice():Money {
        return this._items.reduce((total, item)=>
        total.add(item.calculatePrice()), new Money(0, this._currency))
    }

    public getFormatedOrderAt(): string{
        return this._orderAt.format(this._customerId);
    }


    public confirm(): void{
        if(this._state === "PENDING") {
            this._state = "PENDING";
        }else{
            throw new Error(`Cannot confirm order in state ${this._state}`);
        }
    }

    public cancel(): void{
        if(this._state === "SHIPPED" || this._state === "CANCELLED") {
            throw new Error(`Cannot cancel order in state ${this._state}`);
        }
        this._state = "CANCELLED";
    }

    private canAddItems(): boolean{
        return this._state != "CANCELLED" && this._state != "SHIPPED";
    }
}