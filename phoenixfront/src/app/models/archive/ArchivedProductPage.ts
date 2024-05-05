import {  ArchivedProductsDTO } from "./ArchivedProductsDTO";

export interface ArchivedProductPage {
    content: ArchivedProductsDTO[];
    totalPages: number;
    totalElements: number;
    number: number;
  }
  