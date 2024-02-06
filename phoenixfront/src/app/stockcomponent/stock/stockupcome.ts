
/*


   this.stockservice.getStockWithCampaigns(page, size).subscribe(
    (data) => {
      this.stocks = data.content;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
      this.currentPage = data.number + 1;
      this.loading = false;

      if (this.stocks.length > 0) {
        this.emptyStock = false;
        console.log("emptyStock: " + this.emptyStock);
      }
    },
    (error) => {
      console.error('Failed to fetch stocks:', error);
      this.loading = false;
    }
  );
}


} */