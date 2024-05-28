import { ProductSale } from "./product-sale";

export interface Sale {
  id: string;
  orderId: string;
  total: number;
  orderNumber: string;
  createdAt: string;
  productSales: ProductSale[]
}
