import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stockdto } from '../models/inventory/Stock';
import { Observable, Observer, catchError, throwError } from 'rxjs';
import { Productdto } from '../models/inventory/ProductDto';
import * as XLSX from 'xlsx';
import { UncheckHistory } from '../models/inventory/UncheckHistory';
import { StockPage } from '../models/inventory/StockPage';
import { ProductPage } from '../models/inventory/ProductPage';
import { AgentProdDto } from '../models/inventory/AgentProdDto';
import { map } from 'rxjs/operators';
import { SoldProductPage } from '../models/inventory/SoldProductPage';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly apiUrl = "http://localhost:9000/stock";
  constructor(private http: HttpClient) { }

  addStock(stockDto: Stockdto, campaignReference: string): Observable<number> {
    return this.http.post<number>(this.apiUrl + '/addStock/'+ campaignReference, stockDto)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}


getStockWithCampaigns(page: number, size: number, searchTerm: String): Observable<StockPage> {
  const apiUrl = this.apiUrl + '/getStocksWithTheirCampaigns?page=' + page + '&size=' + size + '&searchTerm=' + searchTerm;
  return this.http.get<StockPage>(apiUrl)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}


getStockByreference(reference: string): Observable<Stockdto> {
  return this.http.get<Stockdto>(this.apiUrl + '/getStockByReference/' + reference)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

addProduct(productDto: Productdto): Observable<number> {
  return this.http.post<number>(this.apiUrl + '/addProduct', productDto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getProductsByStockReference(stockreference: string): Observable<Productdto[]> {
  return this.http.get<Productdto[]>(this.apiUrl + '/getProductsByStockReference/' + stockreference)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}


getProductsPaginatedByStockReference(stockReference: string, page: number, size: number, searchTerm: String): Observable<ProductPage> {
  const apiUrl = this.apiUrl + '/getProductsPaginatedByStockReference/' + stockReference + '?page=' + page + '&size=' + size + '&searchTerm=' + searchTerm;
  return this.http.get<ProductPage>(apiUrl)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}


updateProduct(serialNumber: string, productdto: Productdto): Observable<Productdto> {
  return this.http.put<Productdto>(this.apiUrl + '/updateProduct/'+ serialNumber , productdto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}


getProductByserialNumber(serialNumber: string): Observable<Productdto> {
  return this.http.get<Productdto>(this.apiUrl + '/getProductByserialNumber/' + serialNumber)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

uploadFile(file: File, stockReference: string): Observable<string[]> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<string[]>(this.apiUrl + "/uploadcsv/" + stockReference , formData);
}

addProdbyuploadFile(file: File, stockReference: string): Observable<number> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<number>(this.apiUrl + "/addProductsByupload/" + stockReference , formData);
}

excelToCsv(excelFile: File, selectedSheetIndex: number): Observable<File> {
  return new Observable((observer: Observer<File>) => {
    const reader: FileReader = new FileReader();

    reader.onload = (event: any) => {
      const data: string | ArrayBuffer = event.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
      if (workbook.SheetNames.length === 0) {
        observer.error('No sheets found in the Excel file.');
        return;
      }
      if (selectedSheetIndex < 0 || selectedSheetIndex >= workbook.SheetNames.length) {
        observer.error('Invalid sheet index selected.');
        return;
      }

      // Assume the first sheet is the one you want to convert
      const selectedSheetName = workbook.SheetNames[selectedSheetIndex];
      const csvData: string = XLSX.utils.sheet_to_csv(workbook.Sheets[selectedSheetName]);

      const blob = new Blob([csvData], { type: 'text/csv' });
      const csvFile: File = new File([blob], `converted_${selectedSheetName}.csv`, { type: 'text/csv' });

      observer.next(csvFile);
      observer.complete();
    };

    reader.onerror = (event: ProgressEvent) => {
      observer.error(event);
    };

    reader.readAsBinaryString(excelFile);
  });
}


getUncheckedHistorybyStockreference(ref: string): Observable<UncheckHistory[]> {
  return this.http.get<UncheckHistory[]>(this.apiUrl + '/getUncheckedHistorybyStockreference/' + ref)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

updateStock(reference: string, stockDto: Stockdto): Observable<Stockdto> {
  return this.http.put<Stockdto>(this.apiUrl + '/UpdateStock/'+ reference , stockDto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}



assignAgentsToProd(agentProdDtos: AgentProdDto[]) {
  return this.http.post(this.apiUrl + '/assignAgentsToProd', agentProdDtos)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getProductsPaginatedByusername(username: string, page: number, size: number): Observable<ProductPage> {
  const apiUrl = this.apiUrl + '/getProductsPaginatedByusername/' + username + '?page=' + page + '&size=' + size;
  return this.http.get<ProductPage>(apiUrl)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}

detachAgentFromProduct(serialNumber: string) {
  return this.http.delete(this.apiUrl + '/detachAgentFromProduct/' + serialNumber)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

detachManagerFromProduct(serialNumber: string) {
  return this.http.delete(this.apiUrl + '/detachManagerFromProduct/' + serialNumber)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}


UpdateAgentonProd(agentRef: string, agentProdDto: AgentProdDto): Observable<AgentProdDto> {
  return this.http.put<AgentProdDto>(this.apiUrl + '/UpdateAgentonProd/'+ agentRef , agentProdDto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}



getStocksByStocksReferences(): Observable<String[]> {
  const apiUrl = this.apiUrl + '/getStocksByStocksReferences';
  return this.http.get<String[]>(apiUrl)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}

checkProducts(stockReference: string, prodsRef: Set<string>): Observable<string> {
  return this.http.post(this.apiUrl + '/stockcheck/' + stockReference, prodsRef, { responseType: 'arraybuffer' })
    .pipe(
      map(response => {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(response);
      })
    );
}


sellProduct(agentProdDto: AgentProdDto, prodRef: string): Observable<number> {
  return this.http.post<number>(this.apiUrl + '/sellProduct/'+ prodRef, agentProdDto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getSoldProductsPaginatedByStockReference(stockReference: string, page: number, size: number, searchTerm: String): Observable<SoldProductPage> {
  const apiUrl = this.apiUrl + '/getSoldProductsPaginatedByStockReference/' + stockReference + '?page=' + page + '&size=' + size + '&searchTerm=' + searchTerm;
  return this.http.get<SoldProductPage>(apiUrl)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}


getSoldProductsByusername(username: string, page: number, size: number): Observable<SoldProductPage> {
  const apiUrl = this.apiUrl + '/getSoldProductsByusername/' + username + '?page=' + page + '&size=' + size;
  return this.http.get<SoldProductPage>(apiUrl)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}



uploadcsvTocheckSell(file: File, stockReference: string): Observable<string[]> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<string[]>(this.apiUrl + "/uploadcsvTocheckSell/" + stockReference , formData);
}

getProductsInfo(stockReference: string): Observable<any> {
  const url = `${this.apiUrl}/products-info?stockReference=${stockReference}`;
  return this.http.get<any>(url);
}

getSoldProductsInfo(stockReference: string): Observable<any> {
  const url = `${this.apiUrl}/soldproducts-info?stockReference=${stockReference}`;
  return this.http.get<any>(url);
}


}
