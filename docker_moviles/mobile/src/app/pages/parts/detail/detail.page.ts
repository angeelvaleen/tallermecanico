import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Part {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-parts-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  part: Part | null = null;
  messageError:string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerPart();
  }

  async chargerPart(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageError='No se proporciono ID';
      return;
    }
    
    const loading = await this.loading.create({
      message:"Cargando refaccion...",
      spinner:"bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Part }>(
        `${environment.apiUrl}/parts/${encodeURIComponent(id)}`
      );
      this.part = response.data.data;
    } catch (error) {
      this.messageError="Revisar id, conexion a base de datos o permisos";
      console.log('Error al cargar detalle de refaccion', error);
    }finally{
      await loading.dismiss();
    }
  }
}