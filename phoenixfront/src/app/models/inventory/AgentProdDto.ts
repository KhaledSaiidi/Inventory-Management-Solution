import { Productdto } from "./ProductDto";
import { ReclamationDto } from "./ReclamationDto";

export interface AgentProdDto {
     agentRef?: string;
     username?: string;
     firstname?: string;
     lastname?: string;
     seniorAdvisorusername?: string;
     seniorAdvisorFirstName?: string;
     seniorAdvisorLastName?: string;

     productsSoldBy?: Productdto[];
     productsAssociated?: Productdto[];
     reclamations?: ReclamationDto[];
}