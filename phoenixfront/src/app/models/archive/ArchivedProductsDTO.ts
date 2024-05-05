export interface ArchivedProductsDTO {
    serialNumber?: string;
    simNumber?: string;
    checkin?: Date;
    checkout?: Date;
    boxNumber?: string;
    productType?: string;
    brand?: string;
    prodName?: string;
    comments?: string;
    price?: number;
    returned?: boolean;
    returnedstatus?: boolean;
    checkedExistence?: boolean;
    stockReference?: string;
}
