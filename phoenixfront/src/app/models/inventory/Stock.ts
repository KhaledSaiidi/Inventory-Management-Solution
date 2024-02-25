import { Campaigndto } from "../agents/Campaigndto";
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
    campaigndto?: Campaigndto;
    stockValue?: number;
    soldproducts?: SoldProductDto[];
}