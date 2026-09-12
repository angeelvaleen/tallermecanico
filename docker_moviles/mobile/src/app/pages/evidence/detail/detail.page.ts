import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  size: number;
  created_at: string;
}

@Component({
  selector: 'app-evidence-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  evidence: Evidence | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerEvidenceById(id);
    }
  }

  async chargerEvidenceById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Evidence }>(
        `${environment.apiUrl}/items/evidence/${id}`
      );
      this.evidence = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de evidencia', error);
    }
  }
}