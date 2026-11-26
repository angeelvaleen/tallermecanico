import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth';

interface History {
  id: number;
  vehicle_id: number;
  workorder_id: number;
  created_at: string;
}

@Component({
  selector: 'app-history-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  history: History | null = null;
  messageError:string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.chargerHistory();
  }

  async chargerHistory(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
        this.messageError="No se proporciono ID";
        return;
    };

    const loading = await this.loading.create({
      message:'Cargando historial...',
      spinner:'bubbles',
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: History }>(
        `${environment.apiUrl}/history/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      );

      this.history = response.data.data;
    } catch (error) {
      this.messageError="No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    }finally{
      await loading.dismiss();
    }
  }
}