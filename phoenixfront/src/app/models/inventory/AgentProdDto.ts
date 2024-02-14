import { Productdto } from "./ProductDto";

export interface AgentProdDto {
     agentRef?: string;
     username?: string;
     firstname?: string;
     lastname?: string;
     affectaiondate?: Date;
     duesoldDate?: Date;
     receivedDate?: Date;
     seniorAdvisor?: boolean;
     productsManaged?: Productdto[];
     productsSoldBy?: Productdto[];
     productsAssociated?: Productdto[];
}