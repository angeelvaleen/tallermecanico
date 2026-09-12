import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Method {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-methods-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  method: Method | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerMethodById(id);
    }
  }

  async chargerMethodById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Method }>(
        `${environment.apiUrl}/items/methods/${id}`
      );
      this.method = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de metodo', error);
    }
  }
}