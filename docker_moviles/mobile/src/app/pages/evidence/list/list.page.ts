import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  created_at: string;
}

@Component({
  selector: 'app-evidence-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  evidences: Evidence[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerEvidences();
  }

  async chargerEvidences(): Promise<void> {
    try {
      const response = await axios.get<{ data: Evidence[] }>(
        `${environment.apiUrl}/evidence`
      );
      this.evidences = response.data.data;
    } catch (error) {
      console.log('Error al cargar evidencias', error);
    }
  }
}