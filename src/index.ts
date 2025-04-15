import {Customer} from "./src/domain/model/customer";
import {Currency} from "./shared/domain/model/currency";
import {SalesOrder} from "./sales/domain/model/sales-order";

console.log('Happy developing ✨')

try {
    const customer = new Customer("John Doe");
    const usdCurrencyCode = "USD" as const;
    const usdCurrency = new Currency(usdCurrencyCode);
    const realTimeSalesOrder = new SalesOrder(customer.id, usdCurrency);
    realTimeSalesOrder.addItem("P001", 2, 100);
    realTimeSalesOrder.addItem("P002", 20, 50);
    realTimeSalesOrder.confirm();
    customer.lastOrderPrice = realTimeSalesOrder.calculateTotalPrice();
    console.log(`Customer: ${customer.name}`);
    console.log(`Order ID: ${realTimeSalesOrder.id}`);
    console.log(`Order State: ${realTimeSalesOrder.state}`);
    console.log(`Total: ${customer.lastOrderPrice.format()}`);
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
    } else {
        console.error("An unexpected error occurred:", error);
    }
}