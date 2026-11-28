import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Method, MethodServices } from 'src/app/services/methods/methods';

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
    private methodServices: MethodServices,
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
      this.method = await firstValueFrom(this.methodServices.detail(Number(id)));
    } catch (error) {
      this.messageError="No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura."
    }finally{
      await loading.dismiss();
    }
  }
}
