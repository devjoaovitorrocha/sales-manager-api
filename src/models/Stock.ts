interface Stock{
    id?: number,
    fk_idproduct: number,
    color: string,
    expiration_date?: string,
    quantity: number,
    quantity_type: string
}

export default Stock