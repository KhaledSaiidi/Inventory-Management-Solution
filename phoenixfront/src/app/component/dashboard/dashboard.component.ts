import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { TopSalesDto } from 'src/app/models/agents/TopSalesDto';
import { Userdto } from 'src/app/models/agents/Userdto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { AgentsService } from 'src/app/services/agents.service';
import { StockService } from 'src/app/services/stock.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(
    private stockservice: StockService,
    private agentservice: AgentsService
  ) {}

  slides = [
    {
      image: '../../../assets/img/logores.png',
      title: 'Optimize with UniStock Keeper',
      description: 'A powerful platform for efficient and strategic inventory management.'
    },
    {
      image: '../../../assets/img/trackback.jpg',
      title: 'Track Your Inventory with Precision',
      description: 'Efficiently monitor and manage your inventory with UniStock Keeper\'s advanced tracking capabilities.'
    },
    {
      image: '../../../assets/img/kpis.jpg',
      title: 'Empower Your Decisions with Insightful Dashboards',
      description: 'UniStock Keeper takes inventory management to the next level with dynamic and insightful dashboards.'
    }
  ];
  activeIndex = 0;
  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }
  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }
  currentDate!: Date;

  productsSold!: number[];
  productsReturned!: number[];
  loadingSales: boolean = true;
  emptyTopSales: boolean = true;

  loadingReturns: boolean = true;
  emptyReturns: boolean = true;

  ngOnInit() {
   this.initializeChart();
   setInterval(() => {
    this.nextSlide();
  }, 4000);
  this.getThelast2ReturnedProdsByusername();
  this.getlastMonthlySoldProds();  
  this.getSoldProductsStatistics();
  this.getCampaignStatistics();
  this.getProductNumberNow();
  this.getReturnedProductsStatistics();
  this.currentDate = new Date();
}

initializeChart(): void {
  forkJoin([
    this.getProductsSoldCount().pipe(
      catchError(error => {
        console.error('Error fetching products sold count:', error);
        return of(Array(12).fill(0));
      })
    ),
    this.getProductsReturnedCount().pipe(
      catchError(error => {
        console.error('Error fetching products returned count:', error);
        return of(Array(12).fill(0));
      })
    )    
  ]).subscribe(([productsSold, productsReturned]) => {
    var ctx: any = document.getElementById("chart-line");
    var ctx1 = ctx.getContext("2d");
    var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

    var gradientStroke2 = ctx1.createLinearGradient(0, 230, 0, 50);
    gradientStroke2.addColorStop(1, 'rgba(0, 184, 216, 0.2)');
    gradientStroke2.addColorStop(0.2, 'rgba(0, 184, 216, 0.0)');
    gradientStroke2.addColorStop(0, 'rgba(0, 184, 216, 0)');

    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Jan", "Fev", "Mar", "Avr", "May", "Juin", "Jul", "Aout", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Number of products sold",
          tension: 0.4,
          pointRadius: 0,
          borderColor: "#5e72e4",
          backgroundColor: gradientStroke1,
          borderWidth: 3,
          fill: true,
          data: productsSold
        },
        {
          label: "Number of returned products",
          tension: 0.4,
          pointRadius: 0,
          borderColor: "#00b8d8",
          backgroundColor: gradientStroke2,
          borderWidth: 3,
          fill: true,
          data: productsReturned
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              display: true,
              padding: 10,
              color: '#fbfbfb',
              font: {
                size: 11,
                family: "Open Sans",
                style: 'normal',
                lineHeight: 2
              },
            }
          },
          x: {
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            ticks: {
              display: true,
              color: '#ccc',
              padding: 20,
              font: {
                size: 11,
                family: "Open Sans",
                style: 'normal',
                lineHeight: 2
              },
            }
          },
        },
      },
    });
  });
}


  returnedMonthly: Productdto[] = [];
  getThelast2ReturnedProdsByusername() {
    this.loadingReturns = true;
    this.emptyReturns = true;
    this.stockservice.getThelastMonthlyReturnedProds()
      .subscribe(
        (products: Productdto[]) => {
          this.returnedMonthly = products;
          this.loadingReturns = false;
          if(this.returnedMonthly && this.returnedMonthly.length > 0) {
            this.emptyReturns = false;
          }
        },
        (error) => {
          console.error('Error fetching last products returned:', error);
          this.loadingReturns = false;
        }
      );
  }  

  salesData: TopSalesDto[] = [];
  
  getlastMonthlySoldProds() {
    this.loadingSales = true;
    this.emptyTopSales = true;
    this.stockservice.getlastMonthlySoldProds()
      .subscribe(
        (data: TopSalesDto[]) => {
          this.salesData = data;
          console.log(this.salesData);
          this.loadingSales = false;
          if(this.salesData && this.salesData.length > 0){
            this.emptyTopSales = false;
          }
        },
        (error) => {
          console.error('Error fetching lastSells:', error);
          this.loadingSales = false;
        }
      );
  }
  
  soldProductsCurrentYear!: number;
  growthRate!: number;


  getSoldProductsStatistics(): void {
    this.stockservice.getSoldProductsStatistics()
      .subscribe(data => {
        this.soldProductsCurrentYear = data.countSoldProductsCurrentYear;
        this.growthRate = data.growthRate;
      });
  }


  campaignsCurrentYear!: number;
  campaignsgrowthRate!: number;


  getCampaignStatistics(): void {
    this.agentservice.getCampaignStatistics()
      .subscribe(data => {
        this.campaignsCurrentYear = data.countCampaignsCurrentYear;
        this.campaignsgrowthRate = data.growthRate;
      });
  }

  productNumberNow!: number;

  getProductNumberNow(): void {
    this.stockservice.getProductNumberNow()
      .subscribe(data => {
        this.productNumberNow = data;
      });
  }


  countReturnedProductsCurrentMonth!: number;
  returngrowthRate!: number;


  getReturnedProductsStatistics(): void {
    this.stockservice.getReturnedProductsStatistics()
      .subscribe(data => {
        this.countReturnedProductsCurrentMonth = data.countReturnedProductsCurrentMonth;
        this.returngrowthRate = data.growthRate;
      });
  }


  getProductsSoldCount() {
    return this.stockservice.getProductsSoldCount();
  }
  

  getProductsReturnedCount() {
    return this.stockservice.getProductsReturnedCount();
  }
  }