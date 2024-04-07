import { AgentProdDto } from "./AgentProdDto";
import { Stockdto } from "./Stock";

export interface Productdto {
    serialNumber?: string;
    simNumber?: string;
    checkin?: Date;
    checkout?: Date;
    boxNumber?: string;
    brand?: string;
    productType?: string;
    prodName?: string;
    comments?: string;
    price?: number;
    returned?: boolean;
    returnedstatus?: boolean;
    checkedExistence?: boolean;
    stock?: Stockdto;
    agentProd?: AgentProdDto;
    managerProd?: AgentProdDto;
     agentwhoSoldProd?: AgentProdDto;
     agentReturnedProd?: AgentProdDto;

}