import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
}

@Component({
  selector: 'app-diagnoses-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  diagnoses: Diagnosis[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerDiagnoses();
  }

  async chargerDiagnoses(): Promise<void> {
    try {
      const response = await axios.get<{ data: Diagnosis[] }>(
        `${environment.apiUrl}/items/diagnoses`
      );
      this.diagnoses = response.data.data;
    } catch (error) {
      console.log('Error al cargar diagnósticos', error);
    }
  }
}