import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Userdto } from 'src/app/models/agents/Userdto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { StockService } from 'src/app/services/stock.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private stockservice: StockService) {}

  slides = [
    {
      image: '../../../assets/img/phoenixres.png',
      title: 'Optimize with PhoenixStock Keeper',
      description: 'A powerful platform for efficient and strategic inventory management.'
    },
    {
      image: '../../../assets/img/trackback.jpg',
      title: 'Track Your Inventory with Precision',
      description: 'Efficiently monitor and manage your inventory with PhoenixStock Keeper\'s advanced tracking capabilities.'
    },
    {
      image: '../../../assets/img/kpis.jpg',
      title: 'Empower Your Decisions with Insightful Dashboards',
      description: 'PhoenixStock Keeper takes inventory management to the next level with dynamic and insightful dashboards.'
    }
  ];
  activeIndex = 0;
  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }
  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  ngOnInit() {
   this.initializeChart();
   setInterval(() => {
    this.nextSlide();
  }, 4000);
  this.getThelast2ReturnedProdsByusername();
  this.getlastMonthlySoldProds();  
}

  initializeChart(): void {
    var ctx: any = document.getElementById("chart-line");
    var ctx1 = ctx.getContext("2d");
    var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
    
    gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');
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
        data: [20, 30, 10, 20, 20, 15, 16, 20, 15, 14, 12, 10]
    }],
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
  }


  returnedMonthly: Productdto[] = [];
  getThelast2ReturnedProdsByusername() {
    this.stockservice.getThelastMonthlyReturnedProds()
      .subscribe(
        (products: Productdto[]) => {
          this.returnedMonthly = products;
        },
        (error) => {
          console.error('Error fetching last products returned:', error);
        }
      );
  }  

  salesData: Map<string, number> = new Map();
  mapEntries: (string | number)[][] = [];
  isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }
  
  getlastMonthlySoldProds() {
    this.stockservice.getlastMonthlySoldProds()
      .subscribe(
        (data: any) => {
          const salesDataMap = new Map<string, number>();
          for (const [key, value] of Object.entries(data)) {
            if (this.isNumber(value)) {
              salesDataMap.set(key, value);
            } else {
              console.warn(`Skipping key '${key}' due to non-numeric value`);
            }
          }
          this.salesData = salesDataMap;
          console.log(this.salesData);

          this.mapEntries = Array.from(this.salesData.entries());

        },
        (error) => {
          console.error('Error fetching lastSells:', error);
        }
      );
  }
  
  

}
            // console.log(Array.from(this.salesData.entries()));
