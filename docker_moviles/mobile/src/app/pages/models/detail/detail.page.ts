import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Model {
  id: number;
  brand_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-models-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  model: Model | null = null;
  messageError:string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerModel();
  }

  async chargerModel(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      this.messageError="No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message:'Cargando modelo...',
      spinner:'bubbles',
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Model }>(
        `${environment.apiUrl}/models/${encodeURIComponent(id)}`
      );
      this.model = response.data.data;
    } catch (error) {
      this.messageError="Revisar id,conexion a base de datos o permisos";
      console.log('Error al cargar detalle de modelo', error);
    }finally{
      await loading.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.model) {
      return;
    }
    const url = `${environment.apiUrl}/models/${this.model.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}