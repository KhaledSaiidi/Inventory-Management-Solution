export interface Userdto {
    firstName?: string;
    lastName?: string;
    email?: string;
    userName?: string;
    password?: string;
    realmRoles?: string[] | null;
    image?: string | null;
    phone?: number;
    jobTitle?: string;
    dateDebutContrat?: Date;
    dateFinContrat?: Date;
}