import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {

  brands: Brand[] = [];
  constructor() {}

  ngOnInit() {
    this.chargerBrands();
  }

  async chargerBrands():Promise<void> {
    try {
      const response = await axios.get<{ data: Brand[] }>(
        `${environment.apiUrl}/brands`
      );


      this.brands = response.data.data;
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  }

}