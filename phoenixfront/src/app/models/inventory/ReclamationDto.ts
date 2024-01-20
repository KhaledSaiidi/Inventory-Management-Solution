import { AgentProdDto } from "./AgentProdDto";
import { ReclamType } from "./ReclamType";

export interface ReclamationDto {
    reclamationType?: ReclamType;
    reclamationText?:  string;
    senderReference?: string;
    receiverReference?: string;
    serialNumberOfReturnedStock?: string;
    campaignReference?: string;
    productType?: string;
    quantityToAdd?: number;
    reclamDate?: Date;
    vued?: boolean;
    agentProd?: AgentProdDto;

}