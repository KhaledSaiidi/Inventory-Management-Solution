import { SoldProductDto } from "./SoldProductDto";

export interface SoldProductPage {
    content: SoldProductDto[];
    totalPages: number;
    totalElements: number;
    number: number;
  }
