import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface ModelItem {
  id: number;
  brand_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-models-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  modelItem: ModelItem | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerModelById(id);
    }
  }

  async chargerModelById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: ModelItem }>(
        `${environment.apiUrl}/items/models/${id}`
      );
      this.modelItem = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de modelo', error);
    }
  }
}