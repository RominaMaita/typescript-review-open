import {DateTime} from "../../../shared/domain/model/date-time";
import {SalesOrderItem} from "./sales-order-item";
import {Currency} from "../../../shared/domain/model/currency";
import { v4 as uuidv4 } from 'uuid';
import {Money} from "../../../shared/domain/model/money";

export type SalesOrderState = "PENDING" | "CONFIRMED" | "SHIPPED" | "CANCELLED";

export class SalesOrder {
    private readonly _customerId: string;
    private readonly _id: string;
    private readonly _items: SalesOrderItem[];
    private readonly _orderedAt: DateTime;
    private readonly _currency: Currency;
    private _state: SalesOrderState;

    constructor(customerId: string,
                currency: Currency,
                orderedAt?: Date | string) {
        if (!customerId || customerId.trim() === "" ) {
            throw new Error("Customer ID is required. It cannot be empty");
        }
        this._id = uuidv4();
        this._customerId = customerId;
        this._currency = currency;
        this._items = [];
        this._orderedAt = new DateTime(orderedAt);
        this._state = "PENDING";
    }
    public get id(): string { return this._id; }
    public get customerId(): string { return this._customerId; }
    public get orderedAt(): DateTime { return this._orderedAt; }
    public get state(): SalesOrderState { return this._state; }
    public get currency(): Currency { return this._currency; }

    public addItem(productId: string,
                   quantity: number,
                   unitPriceAmount:number): void {
        if (!productId || productId.trim() === "" ) {
            throw new Error("Product ID is required. It cannot be empty");
        }
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
        if (!this.canAddItems()) {
            throw new Error(`Cannot add items to order in state ${this._state}`);
        }
        const unitPrice = new Money(unitPriceAmount, this._currency);
        const item = new SalesOrderItem(this._id, productId.trim(), quantity, unitPrice);
        this._items.push(item);
    }

    public calculateTotalPrice(): Money {
        return this._items.reduce((total, item) =>
            total.add(item.calculatePrice()), new Money(0, this._currency));
    }

    public getFormattedOrderedAt(): string {
        return this._orderedAt.format();
    }

    public confirm(): void {
        if (this._state == "PENDING") {
            this._state = "CONFIRMED";
        } else {
            throw new Error(`Cannot confirm order in state ${this._state}`);
        }
    }

    public ship(): void {
        if (this._state == "CONFIRMED") {
            this._state = "SHIPPED";
        } else {
            throw new Error(`Cannot ship order in state ${this._state}`);
        }
    }

    public cancel(): void {
        if (this._state == "SHIPPED" || this._state == "CANCELLED") {
            throw new Error(`Cannot cancel order in state ${this._state}`);
        }
        this._state = "CANCELLED";
    }

    private canAddItems(): boolean {
        return this._state != "CANCELLED" && this._state != "SHIPPED";
    }
}