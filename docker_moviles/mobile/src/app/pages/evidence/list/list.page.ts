import { Component, OnInit } from '@angular/core';
import { EvidenceServices } from 'src/app/services/evidences/evidences';
import { firstValueFrom } from 'rxjs';


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

  constructor(
    private evidenceServices: EvidenceServices,
  ) {}

  ngOnInit() {
    this.chargerEvidences();
  }

  async chargerEvidences(): Promise<void> {
    try {
      this.evidences = await firstValueFrom(this.evidenceServices.listWithOutFilters());
    } catch (error) {
      console.log('Error al cargar evidencias', error);
    }
  }
}