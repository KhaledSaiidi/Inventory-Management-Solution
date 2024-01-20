import { Productdto } from "./ProductDto";
import { ReclamationDto } from "./ReclamationDto";

export interface AgentProdDto {
     agentRef?: string;
     agentManagerReference?: string; 
     products?: Productdto[];
    reclamations?: ReclamationDto[];

}