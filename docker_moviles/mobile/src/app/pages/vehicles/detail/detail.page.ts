import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Vehicle {
  id: number;
  model_id: number;
  user_id: number;
  fuel_id: number;
  color_id: number;
  plate: string;
  vin: string;
  year: string;
  mileage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-vehicles-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {

  vehicle: Vehicle | null = null;
  messageError:string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) { }

  ngOnInit() {
    this.chargerVehicle();
  }

  async chargerVehicle(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageError='No se proporciono ID';
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando vehiculo...",
      spinner:"crescent",
    })

    await loading.present();

    try {
      const response = await axios.get<{ data: Vehicle }>(
        `${environment.apiUrl}/vehicles/${encodeURIComponent(id)}`
      );
      this.vehicle = response.data.data;
    } catch (error) {
      this.messageError="Revisar id, conexion a base de datos o permisos"
      console.log('Error al cargar detalle del vehiculo', error);
    }finally{
      await loading.dismiss();
    }
  }

}