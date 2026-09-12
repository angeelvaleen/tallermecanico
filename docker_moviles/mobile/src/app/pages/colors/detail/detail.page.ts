import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Color {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-colors-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  color: Color | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerColorById(id);
    }
  }

  async chargerColorById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Color }>(
        `${environment.apiUrl}/items/colors/${id}`
      );
      this.color = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de color', error);
    }
  }
}