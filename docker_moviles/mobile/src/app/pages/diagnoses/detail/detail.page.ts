import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
  created_at: string;
}

@Component({
  selector: 'app-diagnoses-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  diagnosis: Diagnosis | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerDiagnosisById(id);
    }
  }

  async chargerDiagnosisById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Diagnosis }>(
        `${environment.apiUrl}/items/diagnoses/${id}`
      );
      this.diagnosis = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de diagnostico', error);
    }
  }
}