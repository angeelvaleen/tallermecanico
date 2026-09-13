import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
2
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
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerDiagnosis();
  }

  async chargerDiagnosis(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      this.messageError='No se recibio ID';
      return;
    }

    const loading = await this.loading.create({
      message:'Cargando diagnostico...',
      spinner:'bubbles',
    });
    
    await loading.present();

    try {
      const response = await axios.get<{ data: Diagnosis }>(
        `${environment.apiUrl}/diagnoses/${encodeURIComponent(id)}`
      );

      this.diagnosis = response.data.data;
    } catch (error) {
      console.error("Error al cargar diagnostico:", error);
      this.messageError="No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    }finally{
      await loading.dismiss();
    }
  }
}