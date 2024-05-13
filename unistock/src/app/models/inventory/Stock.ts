import { Productdto } from "./ProductDto";
import { SoldProductDto } from "./SoldProductDto";

export interface Stockdto {
    stockReference?: string;
    productTypes?: string[];
    campaignRef?: string; 
    shippingDate?: Date;
    receivedDate?: Date;
    dueDate?: Date;
    checked?: boolean;
    notes?: string;
    products?: Productdto[];
    stockValue?: number;
    soldproducts?: SoldProductDto[];
}