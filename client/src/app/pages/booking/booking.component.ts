import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  currentStep = 1;
  bookingForm: FormGroup;
  selectedItem = {
    name: 'Serengeti Lodge',
    location: 'Serengeti, Tanzania',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    price: 299,
    type: 'hotel' // or 'safari'
  };

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      guestInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      }),
      bookingDetails: this.fb.group({
        checkIn: ['', Validators.required],
        checkOut: ['', Validators.required],
        guests: this.fb.group({
          adults: [1, [Validators.required, Validators.min(1)]],
          children: [0, [Validators.required, Validators.min(0)]]
        }),
        roomType: ['Standard', Validators.required]
      }),
      specialRequests: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Set minimum date as today for check-in
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.querySelector('input[name="checkIn"]');
    if (checkInInput) {
      checkInInput.setAttribute('min', today);
    }
  }

  onCheckInChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const checkOutInput = document.querySelector('input[name="checkOut"]');
    if (checkOutInput) {
      checkOutInput.setAttribute('min', input.value);
    }
    this.updatePriceSummary();
  }

  updatePriceSummary() {
    // TODO: Implement price calculation based on dates and guests
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      // TODO: Implement booking submission
      console.log('Booking form submitted:', this.bookingForm.value);
    } else {
      this.markFormGroupTouched(this.bookingForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
