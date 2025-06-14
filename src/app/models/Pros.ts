export default interface Pros {
  id_pros: number;
  unit_pros: number;
  price_pros: number; // DECIMAL(10, 2)
  id_product: number;
  id_provider: number;
  id_category: number;
  name_product?: string;
  description_product?: string;
  photo_product?: string;
  name_provider?: string;
  cif_provider?: string;
  // name_category?: string;
}
