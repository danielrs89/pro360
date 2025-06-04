export default interface Sales {
    id_sales: number,
    id_product: number,
    unit_sales: number,
    price_sales: number, // DECIMAL(10, 2)
    date_sales: string, //DATE
    id_provider: number
}