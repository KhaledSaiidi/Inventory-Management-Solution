import { Stockdto } from "./Stock";

export interface StockPage  {
    content: Stockdto[];
    totalPages: number;
    totalElements: number;
    number: number;
  
}