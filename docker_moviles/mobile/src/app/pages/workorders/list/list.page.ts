import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Workorder {
  id: number;
  vehicle_id: number;
  mileage: number;
  delivery: string;
}

@Component({
  selector: 'app-workorders-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  workorders: Workorder[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerWorkorders();
  }

  async chargerWorkorders(): Promise<void> {
    try {
      const response = await axios.get<{ data: Workorder[] }>(
        `${environment.apiUrl}/workorders`
      );
      this.workorders = response.data.data;
    } catch (error) {
      console.log('Error al cargar órdenes', error);
    }
  }
}