import { ReclamType } from "./ReclamType";

export interface ReclamationDto {
    id?: number;
    reclamationType?: ReclamType;
    reclamationText?: string;
    senderReference?: string;
    receiverReference?: string[];
    vuedreceivers?: string[];
    reclamDate?: Date;

}