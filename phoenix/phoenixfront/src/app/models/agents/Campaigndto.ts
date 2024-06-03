import { Clientdto } from "./Clientdto";

export interface Campaigndto {
    reference?: string;
    campaignName?: string;
    products?: string[];
    startDate?: Date;
    campaignDescription?: string;
    client?: Clientdto;
}