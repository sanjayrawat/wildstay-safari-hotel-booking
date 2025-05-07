import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  locations = [
    { name: 'Serengeti', value: 'serengeti' },
    { name: 'Masai Mara', value: 'masai-mara' },
    { name: 'Kruger Park', value: 'kruger-park' }
  ];

  onSearch(event: Event) {
    event.preventDefault();
    // TODO: Implement search functionality
  }
}
