import { Productdto } from "./ProductDto";
import { SoldProductDto } from "./SoldProductDto";

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
     productsAssociated?: Productdto[];

     soldproductsManaged?: SoldProductDto[];
     productsSoldBy?: SoldProductDto[];
     agentproductsAssociated?: SoldProductDto[];
     productssoldAndreturnedAssociated?: Productdto[];
     productsreturnedAssociated?: Productdto[];
}