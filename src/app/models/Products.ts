export default interface Products {
  id_product: number;
  name_product: string;
  description_product: string;
  unit_product: number;
  price_product: number; // DECIMAL(10, 2)
  photo_product: string;
  id_provider: number;
}
