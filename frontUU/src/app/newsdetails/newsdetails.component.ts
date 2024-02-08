import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-newsdetails',
  templateUrl: './newsdetails.component.html',
  styleUrls: ['./newsdetails.component.css']
})
export class NewsdetailsComponent implements OnInit{
  @ViewChild('carousel') carousel: ElementRef | undefined;
  id: string = '';
  images: string[] = [];
  title: string = "";
  body: string = "";

  constructor(private route: ActivatedRoute, private router: Router) {}
  currentIndex = 0;
  nextIndex = 1;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadData(this.id);
    });
    interval(5000).subscribe(() => {
      this.nextSlide();
    });
  }
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateCarousel();
  }

  updateCarousel() {
    if (this.carousel && this.carousel.nativeElement) {
      const offset = -this.currentIndex * 100;
      const transitionClass = 'transitioning'; 
      this.carousel.nativeElement.classList.add(transitionClass);
      this.carousel.nativeElement.style.transform = `translateX(${offset}%)`;

      setTimeout(() => {
        if (this.carousel && this.carousel.nativeElement) {
          this.carousel.nativeElement.classList.remove(transitionClass);
        }
      }, 500); 
    }
  }
    
  getCurrentImage() {
    return this.images[this.currentIndex];
  }
  loadData(casinoId: string): void {
    if(casinoId.toLowerCase() == "gift") {
    this.images = ['../../assets/img/gift.png'];
    this.title = "Phoenix's Festive Gift: Joyful Surprises for Columbus Park Academy Students!";
    this.body = "In the spirit of holiday generosity, Phoenix Marketing and Advertising of Worcester has recently brightened the season for every student at Columbus Park Preparatory Academy. Through a three-month effort, Phoenix's dedication, combined with the collaboration of school staff, resulted in heartwarming smiles and joy. Worcester Schools express their gratitude for Phoenix's generous donation, ensuring that each student received a special holiday gift. This initiative not only exemplifies corporate responsibility but also creates a positive impact on the community. The smiles and excitement witnessed at Columbus Park Preparatory Academy reflect the true essence of the festive season. Happy holidays to all! 🎄✨";
        }
    
    if(casinoId.toLowerCase() == "casino") {
    this.images = [
      '../../assets/img/casino/casino11.jpeg',
      '../../assets/img/casino/casino3.jpeg',
      '../../assets/img/casino/casino4.jpeg',
      '../../assets/img/casino/casino5.jpeg',
      '../../assets/img/casino/casino6.jpeg',
      '../../assets/img/casino/casino7.jpeg',
      '../../assets/img/casino/casino8.jpeg',
      '../../assets/img/casino/casino9.jpeg',
      '../../assets/img/casino/casino10.jpeg'
    ];
    this.title = "Casino Night Phoenix";
    this.body = "Enter the dazzling world of Phoenix Marketing & Advertising's Casino Night Extravaganza, a landmark event that marked the culmination of 2023 and set the tone for an extraordinary 2024. As the fastest-growing direct marketing company in the U.S., we're proud to recognize the dedication of our family members. This exclusive event was a testament to our commitment to fostering a dynamic and engaging workplace, offering our exceptional team a night of opulence and entertainment. Against the backdrop of our core values - integrity, professionalism, innovation and customer focus - Casino Night was marked by thrilling games, a red-carpet welcome, gastronomic delights and recognition of outstanding achievements. It was an evening when our team, more than just colleagues, became a family, celebrating success together in an atmosphere of camaraderie and shared achievement. Join us as we relive the glamour and excitement of this exceptional night, and discover why Phoenix Marketing & Advertising is not just a place to work, but a community where every employee is truly valued, and where success is a collective journey illuminated by our core values.";
        }

    if(casinoId.toLowerCase() == "awards") {
      this.images = [
        '../../assets/img/awards/awards7.jpeg',
        '../../assets/img/awards/awards1.jpeg',
        '../../assets/img/awards/awards2.jpeg',
        '../../assets/img/awards/awards3.jpeg',
        '../../assets/img/awards/awards4.jpeg',
        '../../assets/img/awards/awards5.jpeg',
        '../../assets/img/awards/awards6.jpeg'
      ];
      this.title = "Awards Night Phoenix";
      this.body = "At Phoenix Marketing & Advertising, the Awards Night stands as a beacon of celebration, transforming our annual Christmas party into a heartwarming and memorable event. This special evening is dedicated to honoring the unwavering commitment of our exceptional team, cultivating a spirit of recognition, joy, and camaraderie. The Awards Night is not merely a ceremony; it is a testament to our collective achievements and the incredible journey we embark on together. As we come together to celebrate, we not only acknowledge individual accomplishments but also foster a sense of community, fun, and love within the Phoenix family. It is an event where dedication is recognized, milestones are celebrated, and the bonds that strengthen our team are forged. The Awards Night at Phoenix Marketing & Advertising is more than an occasion; it is a heartfelt expression of gratitude and a reflection of the values that define our thriving corporate culture.";
          }
          if(casinoId.toLowerCase() == "fire") {
            this.images = [
              '../../assets/img/nantuc/nantuc1.jpeg',
              '../../assets/img/nantuc/nantuc2.jpeg',
              '../../assets/img/nantuc/nantuc3.jpeg',
              '../../assets/img/nantuc/nantuc4.jpeg',
              '../../assets/img/nantuc/nantuc5.jpeg',
              '../../assets/img/nantuc/nantuc6.jpeg',
              '../../assets/img/nantuc/nantuc7.jpeg',
              '../../assets/img/nantuc/nantuc8.jpeg',
              '../../assets/img/nantuc/nantuc9.jpeg'
            ];
            this.title = "Fire and success light up Nantucket";
            this.body = "Experience the brilliance of success as Nantucket lights up in acknowledgment of the remarkable contributions made by the dedicated sales agents and staff of Phoenix Marketing & Advertising. In a symbolic and luminous event, we express profound pride and heartfelt gratitude for the unwavering hard work and exceptional success demonstrated by our phenomenal team. The glowing embers of achievement are not only celebrated but also serve as a testament to the collective spirit that fuels our company's growth. This event is a beacon of recognition, casting a spotlight on the individuals who embody the essence of success within the Phoenix family. It's more than just an evening of acknowledgment; it's a radiant celebration of the synergy that propels us toward new heights. At Phoenix, we illuminate the path to success, and in the glow of Nantucket's lights, we recognize and honor the shining stars that make our journey extraordinary.";
                }

                if(casinoId.toLowerCase() == "dreams") {
                  this.images = [
                    '../../assets/img/spreading.jpg',
                    '../../assets/img/spreading2.jpg',
                    '../../assets/img/spreading3.jpg'

                  ];
                  this.title = "Spreading joy and supporting dreams";
                  this.body = "Phoenix President & CEO, Robert Rios, recently paid a visit to Why Me & Sherry's House in Worcester, a heartfelt encounter that reflects our company's commitment to community engagement. During his time there, Robert had the pleasure of connecting with Jade, a remarkable young woman who has been part of the Why Me & Sherry's House community for several years. As Jade embarks on a new chapter by starting college at Worcester State University, Phoenix Marketing and Advertising is proud to support her aspirations. Recognizing Jade's passion for theatre and her dream of becoming a movie star, we ensured she has all the essential tools to thrive as a theatre major. This small yet meaningful gesture represents our dedication to empowering individuals within our community to pursue their dreams. At Phoenix, we believe in fostering connections that extend beyond the business realm, making a positive impact in the lives of those we encounter. Cheers to Jade's bright future and the shared moments that make our community bond stronger. ⭐";
                      }

                      if(casinoId.toLowerCase() == "bobbyfam") {
                        this.images = [
                          '../../assets/img/bobbyfam/bobby0.jpeg',
                          '../../assets/img/bobbyfam/bobby1.jpeg',
                          '../../assets/img/bobbyfam/bobby2.jpeg',
                          '../../assets/img/bobbyfam/bobby3.jpeg',
                          '../../assets/img/bobbyfam/bobby4.jpeg',
                          '../../assets/img/bobbyfam/bobby5.jpeg',
                          '../../assets/img/bobbyfam/bobby6.jpeg',

                        ];
                        this.title = "Unveiling the Heartbeat of Phoenix: A Special Day with Bobby's Family";
                        this.body = "At Phoenix Marketing & Advertising, our commitment to fostering a genuine family environment goes beyond the office walls. Recently, our CEO, Bobby, graciously opened the doors to his personal life, inviting the Phoenix family into his home for a special gathering. The event, marked by warmth and camaraderie, allowed us to meet Bobby's family, experiencing firsthand the unique bond that defines our company culture. In an industry where personal and professional lines often blur, this occasion stood out as a testament to the genuine connections we value at Phoenix. Bobby's willingness to share a slice of his life with the team underscores the familial atmosphere we strive to cultivate. The day was filled with laughter, shared stories, and a sense of unity that transcends the workplace. As we gathered in Bobby's home, it became clear that our CEO's dedication to fostering a family sentiment within the company is not merely a corporate ideal but a lived reality. From casual conversations to shared meals, the event was a reminder that at Phoenix, every team member is not just a colleague but an integral part of a larger, supportive family. This unique gathering showcased the authenticity that sets Phoenix Marketing & Advertising apart. Beyond the campaigns and projects, it's the personal connections that truly define us. Bobby's family became an extension of our own, and the shared experience strengthened the bonds that make Phoenix more than just a workplace—it's a home where each member is valued, respected, and considered part of a larger family. The event marked not only a day of connection but also a celebration of the meaningful relationships that contribute to the heartbeat of Phoenix.";
                            }
                            
                            if(casinoId.toLowerCase() == "summit") {
                              this.images = [
                                '../../assets/img/summit/sum0.jpeg',
                                '../../assets/img/summit/sum1.jpeg',
                                '../../assets/img/summit/sum2.jpeg',
                                '../../assets/img/summit/sum3.jpeg',
                                '../../assets/img/summit/sum4.jpeg',
                                '../../assets/img/summit/sum5.jpeg',
                                '../../assets/img/summit/sum6.jpeg',
                                '../../assets/img/summit/sum7.jpeg'
      
                              ];
                              this.title = "Synergy in Action: An Inspiring Leadership Summit";
                              this.body = "In a remarkable display of collaboration and shared vision, leaders and CEOs from Prodigy and its esteemed partners recently gathered for an impactful Leadership Summit. The event, hosted at a prestigious venue, served as a platform for thought-provoking discussions, strategic planning, and the exchange of innovative ideas that are set to shape the future of our collective endeavors. The Leadership Summit brought together the brilliant minds steering the ship at Prodigy and its partner companies, including the dynamic leadership team from Phoenix Marketing & Advertising. The atmosphere was one of professionalism, mutual respect, and a collective commitment to pushing the boundaries of excellence. Discussions ranged from industry trends and emerging technologies to sustainable business practices and fostering a culture of inclusivity. The leaders, each bringing a wealth of experience and unique insights, engaged in fruitful conversations that transcended individual companies, emphasizing the power of collaboration in driving success. Keynote speakers, industry experts, and collaborative workshops further enriched the summit, providing valuable takeaways for leaders to implement within their respective organizations. The Leadership Summit was not just a meeting of minds; it was a celebration of shared goals, acknowledging the collective impact that can be achieved through a united front. The event not only strengthened professional connections but also fostered a sense of camaraderie among leaders who recognize the importance of collaboration in navigating the evolving business landscape. As Prodigy and its partners move forward, the Leadership Summit stands as a cornerstone, a testament to the power of unity, innovation, and a shared commitment to excellence. The insights gained and relationships forged during this summit are sure to resonate, guiding our organizations toward continued success in the dynamic markets we serve.";
                                  }
  }


}
