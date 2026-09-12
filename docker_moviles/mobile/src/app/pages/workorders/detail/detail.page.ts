import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
  created_at: string;
}

@Component({
  selector: 'app-workorders-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  workorder: Workorder | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerWorkorderById(id);
    }
  }

  async chargerWorkorderById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Workorder }>(
        `${environment.apiUrl}/items/workorders/${id}`
      );
      this.workorder = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de orden de trabajo', error);
    }
  }
}