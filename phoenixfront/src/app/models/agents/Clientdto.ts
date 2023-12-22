import { Campaigndto } from "./Campaigndto";

export interface Clientdto {
    reference?: string;
    companyName?:string;
    companyemail?:string;
    companyphone?: number;
    referentfirstName?:string;
    referentlastName?:string;
    referentemail?:string;
    referentphone?: number;
    campaigns?: Campaigndto[];

}