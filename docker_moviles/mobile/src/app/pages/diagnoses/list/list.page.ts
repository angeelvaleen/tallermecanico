import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
  created_at: string;
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
        `${environment.apiUrl}/diagnoses`
      );
      this.diagnoses = response.data.data;
    } catch (error) {
      console.log('Error al cargar diagnósticos', error);
    }
  }
}