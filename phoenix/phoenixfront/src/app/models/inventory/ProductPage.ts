import { Productdto } from "./ProductDto";

export interface ProductPage {
    content: Productdto[];
    totalPages: number;
    totalElements: number;
    number: number;
  }
  