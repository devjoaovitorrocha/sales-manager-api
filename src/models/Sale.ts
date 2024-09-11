interface Sale{
    id?: number,
    code: number,
    fk_iduser: number,
    fk_idclient: number,
    fk_idaddress: number,
    sale_date: string,
    value: number,
    status: string,
    status_date: string
}

export default Sale