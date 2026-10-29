import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { VehicleDetail, VehicleServices } from 'src/app/services/vehicles/vehicles';

@Component({
  selector: 'app-vehicles-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {

  vehicle: VehicleDetail | null = null;

  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private vehicleService: VehicleServices,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadVehicle();
  }

  async loadVehicle(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.messageError = 'No se proporcionó ID';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando vehículo...',
      spinner: 'crescent',
    });

    await loading.present();

    try {

      this.vehicle = await firstValueFrom(this.vehicleService.detail(Number(id)));
      
      
    } catch (error) {

      this.messageError =
        'Revisar ID, conexión a base de datos o permisos';

      console.log(
        'Error al cargar detalle del vehículo',
        error
      );

    } finally {

      await loading.dismiss();
    }
  }
}