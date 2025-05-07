import { Component } from '@angular/core';

@Component({
  selector: 'app-safaris',
  templateUrl: './safaris.component.html',
  styleUrls: ['./safaris.component.css']
})
export class SafarisComponent {
  priceRange = 1000;
  durations = [
    { name: '1-3 Days', checked: false },
    { name: '4-7 Days', checked: false },
    { name: '8+ Days', checked: false }
  ];
  types = [
    { name: 'Game Drive', checked: false },
    { name: 'Walking Safari', checked: false },
    { name: 'Bird Watching', checked: false },
    { name: 'Photography', checked: false }
  ];
  wildlife = [
    'Lions',
    'Elephants',
    'Giraffes',
    'Zebras'
  ];

  safaris = [
    {
      name: 'Big Five Safari Adventure',
      location: 'Serengeti National Park',
      rating: 4.9,
      price: 1999,
      duration: '5 Days',
      type: ['Game Drive', 'Photography'],
      wildlife: ['Lions', 'Elephants', 'Leopards'],
      features: ['All Meals', 'Professional Guide'],
      image: 'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg',
      description: 'Experience the thrill of seeing Africa\'s Big Five in their natural habitat',
      featured: true
    },
    {
      name: 'Great Migration Safari',
      location: 'Masai Mara',
      rating: 4.8,
      price: 2499,
      duration: '7 Days',
      type: ['Game Drive', 'Photography'],
      wildlife: ['Wildebeest', 'Zebras', 'Lions'],
      features: ['Luxury Camp', 'All Meals'],
      image: 'https://images.pexels.com/photos/59989/elephant-herd-of-elephants-african-bush-elephant-africa-59989.jpeg',
      description: 'Witness the great wildebeest migration across the Serengeti',
      featured: false
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

  toggleWildlife(animal: string) {
    // TODO: Implement wildlife filter toggle
    console.log('Toggling wildlife filter:', animal);
  }
}
