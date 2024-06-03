import { ArchivedSoldProductsDTO } from "./ArchivedSoldProductsDTO";

export interface ArchivedSoldProductPage {
    content: ArchivedSoldProductsDTO[];
    totalPages: number;
    totalElements: number;
    number: number;
  }
  