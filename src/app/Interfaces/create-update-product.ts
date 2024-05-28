export interface CreateUpdateProduct {
  subcategoryId: number;
  brandId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  slug: string;
  tags: string[];
  active: boolean;
}
