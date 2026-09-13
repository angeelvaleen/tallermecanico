import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Fuel {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-fuels-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  fuel: Fuel | null = null;
  messageError:string='';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerFuel();
  }

  async chargerFuel(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      this.messageError="No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando combustible...",
      spinner:"bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Fuel }>(
        `${environment.apiUrl}/fuels/${encodeURIComponent(id)}`
      );
      this.fuel = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de combustible', error);
      this.messageError = "No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    }finally{
      await loading.dismiss();
    }
  }
}