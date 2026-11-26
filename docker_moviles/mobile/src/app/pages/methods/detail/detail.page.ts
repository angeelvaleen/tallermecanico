import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth';

interface Method {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-methods-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  method: Method | null = null;
  messageError:string="";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.chargerMethod();
    
  }

  async chargerMethod(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      this.messageError="No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando metodo de pago...",
      spinner:"bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Method }>(
        `${environment.apiUrl}/methods/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      );

      this.method = response.data.data;
    } catch (error) {
      this.messageError="No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura."
    }finally{
      await loading.dismiss();
    }
  }
}