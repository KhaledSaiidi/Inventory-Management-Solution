import { AgentProdDto } from "./AgentProdDto";
import { Stockdto } from "./Stock";

export interface SoldProductDto {
    serialNumber?: string;
    simNumber?: string;
    checkout?: Date;
    checkedSell?: boolean;
    brand?: string;
    productType?: string;
    prodName?: string;
    comments?: string;
    price?: number;
    soldDate?: Date;
    stock?: Stockdto;
    managerSoldProd?: AgentProdDto;
    agentAssociatedProd?: AgentProdDto;
    agentWhoSold?: AgentProdDto;

}