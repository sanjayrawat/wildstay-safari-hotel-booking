import { Component } from '@angular/core';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent {
  priceRange = 500;
  locations = [
    { name: 'Serengeti', checked: false },
    { name: 'Masai Mara', checked: false },
    { name: 'Kruger Park', checked: false }
  ];
  amenities = [
    { name: 'Pool', checked: false },
    { name: 'Spa', checked: false },
    { name: 'Restaurant', checked: false },
    { name: 'WiFi', checked: false }
  ];
  ratings = [
    { value: 5, label: '5 stars' },
    { value: 4, label: '4+ stars' },
    { value: 3, label: '3+ stars' }
  ];

  hotels = [
    {
      name: 'Serengeti Lodge',
      location: 'Serengeti, Tanzania',
      rating: 4.8,
      price: 299,
      amenities: ['WiFi', 'Pool', 'Restaurant'],
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      description: 'Experience luxury in the heart of the wilderness'
    },
    {
      name: 'Masai Mara Resort',
      location: 'Masai Mara, Kenya',
      rating: 4.9,
      price: 399,
      amenities: ['WiFi', 'Spa', 'Restaurant'],
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      description: 'Luxury accommodations with stunning views'
    }
  ];

  updatePriceRange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.priceRange = parseInt(input.value);
  }

  applyFilters() {
    // TODO: Implement filter logic
    console.log('Applying filters...');
  }
}
