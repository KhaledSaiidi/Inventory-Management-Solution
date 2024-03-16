import { ReclamType } from "./ReclamType";

export interface ReclamationDto {
    id?: number;
    reclamationType?: ReclamType;
    reclamationText?: string;
    senderReference?: string;
    receiverReference?: string[];
    vuedreceivers?: string[];
    serialNumberOfSolddProduct?: String;
    soldDate?: Date;
    serialNumberOfReturnedProduct?: String;
    returnedDate?: Date;
    expirationDate?: Date;
    quantityToAdd?: number;
    reclamDate?: Date;

}