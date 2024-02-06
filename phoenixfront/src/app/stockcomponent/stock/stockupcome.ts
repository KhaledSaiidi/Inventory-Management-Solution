
/*

  constructor(private router: Router, private stockservice: StockService, private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    this.getStocksWithCampaigns(0, 5); 

    this.onSearchInputChange$
    .pipe(debounceTime(600))
    .subscribe(() => {
      const pageSize = 5;
      this.getStocksWithCampaigns(0, pageSize);
    });  
  }
  

stocks!: Stockdto[];
loading: boolean = false;
emptyStock: boolean = true;
totalPages: number = 0;
totalElements: number = 0;
currentPage: number = 1;
pageSize: number = 5;
filterfinishforStocks: Stockdto[] = [];
pagedStocks: Stockdto[][] = [];
searchTerm: string | null = null;
onSearchInputChange$ = new Subject<string>();
onSearchInputChange(): void {
  if(this.searchTerm)
  this.onSearchInputChange$.next(this.searchTerm);
}

getStocksWithCampaigns(page: number, size: number): void {
  this.loading = true;
  this.stockservice.getStockWithCampaigns(page, size).subscribe(
    (data) => {
      this.loading = false;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
      this.currentPage = data.number + 1;
      this.filterfinishforStocks = data.content;
      if (this.searchTerm === null) {
        console.log(this.filterfinishforStocks);
        this.checkAndSetEmptyStocks();
      } else {
        this.handleSearchTerm();
      }
    },
    (error) => {
      this.loading = false;
      console.error('Failed to fetch stocks:', error);
        }
  );
}
private checkAndSetEmptyStocks() {
  if(this.filterfinishforStocks) {
  if (this.filterfinishforStocks.length > 0) {
    this.emptyStock = false;
  } else {
    this.emptyStock = true;
  }} else {
    this.emptyStock = true;
  }
}
onPageChange(newPage: number): void {
  if(!this.searchTerm){
    const pageSize = 5;
    this.getStocksWithCampaigns(newPage - 1, pageSize);
  } else {
    const pageSize = 5;
    this.filterfinishforStocks = this.pagedStocks[newPage - 1];
    this.currentPage = newPage;
}
}  
highlightMatch(value: string): SafeHtml {
  if (this.searchTerm && value) {
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const highlightedValue = value.replace(regex, '<span style="background-color: yellow;">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
  }
  return this.sanitizer.bypassSecurityTrustHtml(value);
}


navigateToStockInfo(ref?: string) {
  if (ref === undefined) {
    console.log('Invalid ref');
    return;
  }
  this.router.navigate(['/stockinfo'], { queryParams: { id: ref } });
  console.log(ref);
}

navigateToUpdateStock(ref?: string) {
  if (ref === undefined) {
    console.log('Invalid ref');
    return;
  }
  this.router.navigate(['/updatestock'], { queryParams: { id: ref } });
  console.log(ref);
}

private handleSearchTerm() {
  const observables: Observable<Stockdto[]>[] = [];
  for (let currentPage = 0; currentPage < this.totalPages; currentPage++) {
    observables.push(
      this.stockservice.getStockWithCampaigns(currentPage, this.pageSize).pipe(
        map(pageData => pageData.content)
      )
    );
  }
  forkJoin(observables).subscribe(
    (pagesData: Stockdto[][]) => {
      this.filterfinishforStocks = [];
      const allMatchedStocks = this.getAllMatchedStocks(pagesData);
      this.totalPages = Math.ceil(allMatchedStocks.length / this.pageSize);
      this.pagedStocks = this.paginateStocks(allMatchedStocks, this.pageSize);

      this.filterfinishforStocks = this.pagedStocks[0];
      this.checkAndSetEmptyStocks();
    },
    (error) => {
      console.error('Failed to get products for page:', error);
      this.loading = false;
    }
  );
}

private getAllMatchedStocks(pagesData: Stockdto[][]): Stockdto[] {
  const datePipe = new DatePipe('en-US');
  const allMatchedStocks: Stockdto[] = [];
  pagesData.forEach(currentStocks => {
    const matchedStocks: Stockdto[] = currentStocks.filter(stock =>
      (stock.stockReference && stock.stockReference.toLowerCase().includes(this.searchTerm!.toLowerCase())) ||
      (stock.campaigndto?.campaignName && stock.campaigndto?.campaignName.toLowerCase().includes(this.searchTerm!.toLowerCase())) ||
      (stock.campaigndto?.client?.companyName && stock.campaigndto?.client?.companyName.toLowerCase().includes(this.searchTerm!.toLowerCase())) ||
      (stock.shippingDate && datePipe.transform(stock.shippingDate, 'MMM dd, yyyy')?.toLowerCase().includes(this.searchTerm!.toLowerCase())) ||
      (stock.dueDate && datePipe.transform(stock.dueDate, 'MMM dd, yyyy')?.toLowerCase().includes(this.searchTerm!.toLowerCase())) ||
      (stock.receivedDate && datePipe.transform(stock.receivedDate, 'MMM dd, yyyy')?.toLowerCase().includes(this.searchTerm!.toLowerCase()))

      );
    allMatchedStocks.push(...matchedStocks);
  });
  return allMatchedStocks;
}
private paginateStocks(allMatchedStocks: Stockdto[], pageSize: number): Stockdto[][] {
  const pagedStocks: Stockdto[][] = [];
  for (let i = 0; i < allMatchedStocks.length; i++) {
    const currentPage = Math.floor(i / pageSize);
    if (!pagedStocks[currentPage]) {
      pagedStocks[currentPage] = [];
    }
    pagedStocks[currentPage].push(allMatchedStocks[i]);
  }
  return pagedStocks;
}


} */