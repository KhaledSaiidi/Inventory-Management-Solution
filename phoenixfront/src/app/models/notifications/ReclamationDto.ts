import { ReclamType } from "./ReclamType";

export interface ReclamationDto {
    id?: number;
    reclamationType?: ReclamType;
    reclamationText?: string;
    senderReference?: string;
    receiverReference?: string;
    serialNumberOfReturnedStock?: string;
    campaignReference?: string;
    productType?: string;
    quantityToAdd?: number;
    reclamDate?: Date;
    vued?: Boolean;
}