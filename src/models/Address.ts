interface Address{
    id?: number,
    fk_id: number,
    street: string,
    number: number,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    country: string
}

export default Address