import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})
export class AddnewsComponent {
  uploadForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      title: [''],
      content: [''],
      images: [null]
    });
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      // You can handle the form submission here
      console.log('Form submitted:', this.uploadForm.value);
    } else {
      // Form is not valid, show error or handle accordingly
      console.log('Form is invalid. Please check the fields.');
    }
  }

  onFileChange(event: any): void  {
    const files = event.target.files;
    if (files?.length > 0) {
      this.uploadForm.get('images')?.setValue(files);
    }
  }

}
