import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Part {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-parts-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  part: Part | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerPartById(id);
    }
  }

  async chargerPartById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Part }>(
        `${environment.apiUrl}/items/parts/${id}`
      );
      this.part = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de refaccion', error);
    }
  }
}