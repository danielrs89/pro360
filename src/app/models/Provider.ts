export default interface Provider {
  id_provider: number;
  cif_provider: string;
  name_provider: string;
  email_provider: string;
  phone_provider: string;
  category_provider: string;
  count_provider: number; // decimal(10,2)
}
