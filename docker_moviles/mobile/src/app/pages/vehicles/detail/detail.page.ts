import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Brand {
  id: number;
  name: string;
}

interface Model {
  id: number;
  brand_id: number;
  name: string;
}

interface Fuel {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  model_id: number;
  user_id: number;
  fuel_id: number;
  color_id: number;
  plate: string;
  vin: string;
  year: number;
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

  brands: Brand[] = [];
  models: Model[] = [];
  fuels: Fuel[] = [];
  colors: Color[] = [];

  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
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

      const [
        vehicleResponse,
        brandsResponse,
        modelsResponse,
        fuelsResponse,
        colorsResponse,
      ] = await Promise.all([
        axios.get<{ data: Vehicle }>(
          `${environment.apiUrl}/vehicles/${encodeURIComponent(id)}`
        ),

        axios.get<{ data: Brand[] }>(
          `${environment.apiUrl}/brands`
        ),

        axios.get<{ data: Model[] }>(
          `${environment.apiUrl}/models`
        ),

        axios.get<{ data: Fuel[] }>(
          `${environment.apiUrl}/fuels`
        ),

        axios.get<{ data: Color[] }>(
          `${environment.apiUrl}/colors`
        ),
      ]);

      this.vehicle = vehicleResponse.data.data;
      this.brands = brandsResponse.data.data;
      this.models = modelsResponse.data.data;
      this.fuels = fuelsResponse.data.data;
      this.colors = colorsResponse.data.data;

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

  getModelName(): string {

    if (!this.vehicle) {
      return 'Sin modelo';
    }

    return (
      this.models.find(
        model => model.id === this.vehicle?.model_id
      )?.name ?? 'Sin modelo'
    );
  }

  getBrandName(): string {

    if (!this.vehicle) {
      return 'Sin marca';
    }

    const model = this.models.find(
      item => item.id === this.vehicle?.model_id
    );

    return (
      this.brands.find(
        brand => brand.id === model?.brand_id
      )?.name ?? 'Sin marca'
    );
  }

  getFuelName(): string {

    if (!this.vehicle) {
      return 'Sin combustible';
    }

    return (
      this.fuels.find(
        fuel => fuel.id === this.vehicle?.fuel_id
      )?.name ?? 'Sin combustible'
    );
  }

  getColorName(): string {

    if (!this.vehicle) {
      return 'Sin color';
    }

    return (
      this.colors.find(
        color => color.id === this.vehicle?.color_id
      )?.name ?? 'Sin color'
    );
  }
}