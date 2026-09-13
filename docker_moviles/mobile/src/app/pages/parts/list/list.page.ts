import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Part {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at:string;
}

@Component({
  selector: 'app-parts-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  parts: Part[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerParts();
  }

  async chargerParts(): Promise<void> {
    try {
      const response = await axios.get<{ data: Part[] }>(
        `${environment.apiUrl}/parts`
      );
      this.parts = response.data.data;
    } catch (error) {
      console.log('Error al cargar partes', error);
    }
  }
}