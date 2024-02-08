import { Component } from '@angular/core';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  loading = false;
  errorMessage!: string;
  successMessage!: string;

  constructor(private mailing: ContactService) {}

  onSubmit(): void {
    this.loading = true;
    
    this.mailing.sendEmail(this.formData).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Your message has been sent. Thank you!';
        this.clearForm();
        console.log("success:" + this.successMessage);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Error sending the message. Please try again later.';
        console.error('Error sending the form:', error);
        console.log("success:" + this.errorMessage);


      }
    );
  }

  clearForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

}
