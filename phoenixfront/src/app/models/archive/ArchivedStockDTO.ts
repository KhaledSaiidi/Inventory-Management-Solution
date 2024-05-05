import { Campaigndto } from "../agents/Campaigndto";
import { ArchivedProductsDTO } from "./ArchivedProductsDTO";
import { ArchivedSoldProductsDTO } from "./ArchivedSoldProductsDTO";

export interface ArchivedStockDTO {
    stockReference?: string;
    productTypes?: string[];
    campaignRef?: string;
    campaigndto?: Campaigndto;
    shippingDate?: Date;
    receivedDate?: Date;
    dueDate?: Date;
    checked?: boolean;
    notes?: string;
    stockValue?: number;
    products?: ArchivedProductsDTO[];
    soldproducts?: ArchivedSoldProductsDTO[];
}
