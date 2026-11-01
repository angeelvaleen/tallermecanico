import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, ModalController } from "@ionic/angular";

import { firstValueFrom } from "rxjs";
import { VehicleCreate,VehicleDetail,VehicleServices } from "src/app/services/vehicles/vehicles";
import { Model,ModelList,ModelServices } from "src/app/services/models/models";
import { Brand,BrandServices } from "src/app/services/brands/brands";
import { Fuel,FuelServices } from "src/app/services/fuels/fuels";
import { Color,ColorServices } from "src/app/services/colors/colors";



@Component({
  selector: "app-vehicles-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  vehicleForm!: FormGroup;

  brands: Brand[] = [];
  models: ModelList[] = [];
  filteredModels: ModelList[] = [];
  fuels: Fuel[] = [];
  colors: Color[] = [];

  saved: boolean = false;
  isEdition: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    brand_id: {
      required: "La marca es requerida",
    },

    model_id: {
      required: "El modelo es requerido",
    },

    fuel_id: {
      required: "El combustible es requerido",
    },

    color_id: {
      required: "El color es requerido",
    },

    plate: {
      required: "La placa es requerida",
      maxlength: "La placa no debe superar los 10 caracteres",
    },

    vin: {
      maxlength: "El VIN no debe superar los 17 caracteres",
    },

    year: {
      required: "El año es requerido",
      pattern: "El año debe tener 4 dígitos",
    },

    mileage: {
      required: "El kilometraje es requerido",
      pattern: "El kilometraje no es válido",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private vehicleServices: VehicleServices,
    private brandServices: BrandServices,
    private fuelServices: FuelServices,
    private colorServices: ColorServices,
    private modelServices: ModelServices,
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    await this.loadBrands();
    await this.loadModels();
    await this.loadFuels();
    await this.loadColors();

    if (this.id) {
      this.isEdition = true;
      await this.loadVehicle();
    }
  }

  private createForm(): void {
    this.vehicleForm = this.formBuilder.group({
      brand_id: ["", [Validators.required]],

      model_id: [
        {
          value: "",
          disabled: true,
        },
        [Validators.required],
      ],

      fuel_id: ["", [Validators.required]],

      color_id: ["", [Validators.required]],

      plate: ["", [Validators.required, Validators.maxLength(10)]],

      vin: ["", [Validators.maxLength(17)]],

      year: ["", [Validators.required, Validators.pattern("^[1-9][0-9]{3}$")]],

      mileage: [
        "",
        [Validators.required, Validators.pattern("^(0|[1-9]\\d{0,5})$")],
      ],
    });
  }

  private async loadBrands(): Promise<void> {
    try {
      
      this.brands = (await firstValueFrom(this.brandServices.listWithOutFilters())).filter((brand) => brand.is_active);
    } catch (error) {
      console.log("Error al cargar marcas", error);

      await this.showAlert("Error", "No fue posible cargar las marcas");
    }
  }

  private async loadFuels(): Promise<void> {
    try {

      this.fuels = (await firstValueFrom(this.fuelServices.listWithOutFilters())).filter((fuel) => fuel.is_active);
    } catch (error) {
      console.log("Error al cargar combustibles", error);

      await this.showAlert("Error", "No fue posible cargar los combustibles");
    }
  }

  private async loadColors(): Promise<void> {
    try {
  
      this.colors = (await firstValueFrom(this.colorServices.listWithOutFilters())).filter((color) => color.is_active);
    } catch (error) {
      console.log("Error al cargar colores", error);

      await this.showAlert("Error", "No fue posible cargar los colores");
    }
  }

  private async loadModels(): Promise<void> {
    try {
      this.models = (
        await firstValueFrom(
          this.modelServices.listWithOutFilters()
        )
      ).filter((model) => model.is_active);

      this.filterModels();

    } catch (error) {
      console.log("Error al cargar modelos", error);

      await this.showAlert(
        "Error",
        "No fue posible cargar los modelos"
      );
    }
  }

  onBrandChange(): void {
    this.vehicleForm.patchValue({
      model_id: "",
    });

    this.filterModels();

    if (this.vehicleForm.get("brand_id")?.value) {
      this.vehicleForm.get("model_id")?.enable();
    } else {
      this.vehicleForm.get("model_id")?.disable();
    }
  }

  private filterModels(): void {
    const brandId = Number(
      this.vehicleForm.get("brand_id")?.value
    );

    if (!brandId) {
      this.filteredModels = [];
      return;
    }

    this.filteredModels = this.models.filter(
      (model) => model.brand_id.id === brandId
    );
  }

  private async loadVehicle(): Promise<void> {
    try {
      await this.loadModels();

      const vehicle = await firstValueFrom(this.vehicleServices.detail(this.id!));

      const model = this.models.find((item) => item.id === vehicle.model_id.id);

      this.vehicleForm.patchValue({
        brand_id: model?.brand_id.id ?? "",
        model_id: vehicle.model_id.id,
        fuel_id: vehicle.fuel_id.id,
        color_id: vehicle.color_id.id,
        plate: vehicle.plate,
        vin: vehicle.vin,
        year: vehicle.year,
        mileage: vehicle.mileage,
      });

      this.filterModels();
    } catch (error) {
      console.log("Error al cargar el vehículo", error);

      await this.showAlert(
        "Error",
        "No fue posible cargar la información del vehículo",
      );
    }
  }

  getError(controlName: string): string {
    const control = this.vehicleForm.get(controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return "";
    }

    const typeError = Object.keys(control.errors)[0];

    return (
      this.validatorsMessage[controlName]?.[typeError] ??
      "El valor ingresado no es válido"
    );
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async saveVehicle(): Promise<void> {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.vehicleForm.value;

    const vehicle: VehicleCreate = {
      user_id: 1,
      model_id: Number(values.model_id),
      fuel_id: Number(values.fuel_id),
      color_id: Number(values.color_id),
      plate: values.plate.trim(),
      vin: values.vin?.trim() ?? "",
      year: Number(values.year),
      mileage: Number(values.mileage),
    };

    try {
      if (this.isEdition && this.id) {
        await firstValueFrom(this.vehicleServices.update(this.id, vehicle));

        await this.showAlert(
          "Vehículo actualizado",
          "El vehículo fue actualizado exitosamente",
        );
      } else {
        await firstValueFrom(this.vehicleServices.create(vehicle));

        await this.showAlert(
          "Vehículo guardado",
          "El vehículo fue guardado exitosamente",
        );
      }

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log("Error al guardar vehículo", error);

      await this.showAlert(
        "Error",
        "No fue posible guardar el vehículo. Revisar los datos, la conexión o los permisos de Directus",
      );
    } finally {
      this.saved = false;
    }
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ["Aceptar"],
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}
