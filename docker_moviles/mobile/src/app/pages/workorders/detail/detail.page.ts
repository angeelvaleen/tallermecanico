import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
  created_at: string;
}

@Component({
  selector: 'app-workorders-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  workorder: Workorder | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerWorkorder();    
  }

  async chargerWorkorder(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageError="No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando order de trabajo...",
      spinner:"crescent",
    });

    await loading.present();
    
    try {
      const response = await axios.get<{ data: Workorder }>(
        `${environment.apiUrl}/workorders/${encodeURIComponent(id)}`
      );
      this.workorder = response.data.data;
    } catch (error) {
      this.messageError="Revisar id, conexion a la base de datos o permisos";
      console.log('Error al cargar detalle de orden de trabajo', error);
    }finally{
      await loading.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.workorder) {
      return;
    }
    const url = `${environment.apiUrl}/workorders/${this.workorder.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}