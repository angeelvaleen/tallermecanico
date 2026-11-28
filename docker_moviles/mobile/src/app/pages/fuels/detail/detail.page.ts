import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Fuel, FuelServices } from 'src/app/services/fuels/fuels';

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
    private fuelServices: FuelServices,
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
      this.fuel = await firstValueFrom(this.fuelServices.detail(Number(id)));
    } catch (error) {
      this.messageError = "No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    }finally{
      await loading.dismiss();
    }
  }
}
