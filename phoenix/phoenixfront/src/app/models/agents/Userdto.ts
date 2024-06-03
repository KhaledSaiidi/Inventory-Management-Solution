export interface Userdto {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
    realmRoles?: string[] | null;
    image?: string | null;
    phone?: number;
    jobTitle?: string;
    dateDebutContrat?: Date;
    dateFinContrat?: Date;
    usertypemanager?: boolean;
    manager?: Userdto;
    associatedProds?: number;
    returnedProds?: number;
    soldProds?: number;
  
}