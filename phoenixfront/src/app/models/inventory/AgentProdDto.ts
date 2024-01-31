import { Productdto } from "./ProductDto";
import { ReclamationDto } from "./ReclamationDto";

export interface AgentProdDto {
     agentRef?: string;
     productsManaged?: Productdto[];
     productsSoldBy?: Productdto[];
     productsAssociated?: Productdto[];
     reclamations?: ReclamationDto[];
}