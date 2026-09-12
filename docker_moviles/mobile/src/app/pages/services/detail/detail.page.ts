import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-services-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  service: Service | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerServiceById(id);
    }
  }

  async chargerServiceById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Service }>(
        `${environment.apiUrl}/items/services/${id}`
      );
      this.service = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de servicio', error);
    }
  }
}