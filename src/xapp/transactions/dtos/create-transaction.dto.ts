export class CreateTransactionDto {
  type: string;
  amount: number;
  description: string;
  category: string;
  sub_category: string;
}
