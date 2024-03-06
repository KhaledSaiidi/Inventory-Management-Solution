import { AgentProdDto } from "./AgentProdDto";
import { State } from "./State";
import { Stockdto } from "./Stock";

export interface Productdto {
    serialNumber?: string;
    simNumber?: string;
    checkin?: Date;
    boxNumber?: string;
    brand?: string;
    productType?: string;
    prodName?: string;
    comments?: string;
    price?: number;
    state?: State;
    checkedExistence?: boolean;
    stock?: Stockdto;
    agentProd?: AgentProdDto;
    managerProd?: AgentProdDto;
     agentwhoSoldProd?: AgentProdDto;
     agentReturnedProd?: AgentProdDto;

}