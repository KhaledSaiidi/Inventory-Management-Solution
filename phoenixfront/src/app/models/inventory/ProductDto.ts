import { AgentProdDto } from "./AgentProdDto";
import { State } from "./State";
import { Stockdto } from "./Stock";

export interface Productdto {
    serialNumber?: string;
    simNumber?: string;
    checkout?: Date;
    checkin?: Date;
    boxNumber?: string;
    checkedSell?: boolean;
    brand?: string;
    productType?: string;
    prodName?: string;
    comments?: string;
    price?: number;
    state?: State;
    soldDate?: Date;
    checkedExistence?: boolean;
    stock?: Stockdto;
    agentProd?: AgentProdDto;
    managerProd?: AgentProdDto;
    agentWhoSold?: AgentProdDto;
}