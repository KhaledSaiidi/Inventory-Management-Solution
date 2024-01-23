import { Campaigndto } from "../agents/Campaigndto";
import { Productdto } from "./ProductDto";

export interface Stockdto {
    stockReference?: string;
    productTypes?: string[];
    campaignRef?: string; 
    stockDate?: Date;
    checked?: boolean;
    notes?: string;
    products?: Productdto[];
    campaigndto?: Campaigndto;
    stockValue?: number;
}