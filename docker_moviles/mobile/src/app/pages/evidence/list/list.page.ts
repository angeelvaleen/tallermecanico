import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
}

@Component({
  selector: 'app-evidence-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  evidenceList: Evidence[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerEvidence();
  }

  async chargerEvidence(): Promise<void> {
    try {
      const response = await axios.get<{ data: Evidence[] }>(
        `${environment.apiUrl}/items/evidence`
      );
      this.evidenceList = response.data.data;
    } catch (error) {
      console.log('Error al cargar evidencias', error);
    }
  }
}