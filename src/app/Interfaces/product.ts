export interface Product {
  id: string;
  subcategoryId: number;
  subcategoryName: string;
  brandId: number;
  brandName: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  slug: string;
  tags: string[];
  active: boolean;
}
