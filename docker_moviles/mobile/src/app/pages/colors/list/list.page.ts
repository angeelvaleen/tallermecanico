import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Color {
  id: number;
  name: string;
  is_active: boolean;
}

@Component({
  selector: 'app-colors-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  colors: Color[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerColors();
  }

  async chargerColors(): Promise<void> {
    try {
      const response = await axios.get<{ data: Color[] }>(
        `${environment.apiUrl}/colors`
      );
      this.colors = response.data.data;
    } catch (error) {
      console.log('Error al cargar colores', error);
    }
  }
}