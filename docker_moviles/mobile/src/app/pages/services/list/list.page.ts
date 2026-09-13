import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active:boolean;
  created_at:string;
}

@Component({
  selector: 'app-services-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  services: Service[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerServices();
  }

  async chargerServices(): Promise<void> {
    try {
      const response = await axios.get<{ data: Service[] }>(
        `${environment.apiUrl}/services`
      );
      this.services = response.data.data;
    } catch (error) {
      console.log('Error al cargar servicios', error);
    }
  }
}