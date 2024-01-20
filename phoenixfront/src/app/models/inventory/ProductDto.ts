import { AgentProdDto } from "./AgentProdDto";
import { State } from "./State";
import { Stockdto } from "./Stock";

export interface Productdto {
    serialNumber?: string;
    productType?: string;
    prodName?: string;
    prodDescription?: string;
    price?: number;
    state?: State;
    soldDate?: Date;
    stock?: Stockdto;
    agentProd?: AgentProdDto;

}