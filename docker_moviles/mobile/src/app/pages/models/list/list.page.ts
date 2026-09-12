import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Model {
  id: number;
  brand_id: number;
  name: string;
  is_active: boolean;
}

@Component({
  selector: 'app-models-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  models: Model[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerModels();
  }

  async chargerModels(): Promise<void> {
    try {
      const response = await axios.get<{ data: Model[] }>(
        `${environment.apiUrl}/items/models`
      );
      this.models = response.data.data;
    } catch (error) {
      console.log('Error al cargar modelos', error);
    }
  }
}