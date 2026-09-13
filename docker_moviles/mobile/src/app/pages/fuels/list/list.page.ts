import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Fuel {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-fuels-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  fuels: Fuel[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerFuels();
  }

  async chargerFuels(): Promise<void> {
    try {
      const response = await axios.get<{ data: Fuel[] }>(
        `${environment.apiUrl}/fuels`
      );
      
      this.fuels = response.data.data;
    } catch (error) {
      console.log('Error al cargar combustibles', error);
    }
  }
}