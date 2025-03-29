export class CreateOrderDto {
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_phone: string;
  };
}
