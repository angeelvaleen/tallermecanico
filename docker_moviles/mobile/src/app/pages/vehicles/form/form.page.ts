import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface VehicleCreate{
  user_id: number,
  model_id: number,
  fuel_id: number,
  color_id: number,
  plate: string,
  vin: string, 
  year: number,
  mileage: number
}

@Component({
  selector: 'app-vehicles-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {

  @Input() id?: number;

  vehicleForm!: FormGroup;
  saved:boolean = false;
  charging:boolean = false;

  validatorsMessage:Record<string,Record<string,string>> = {
    model_id:{
      required:"Modelo es requerido",
    },
    fuel_id:{
      required:"Combustible es requerido",
    },
    color_id:{
      required:"Color es requerido",
    },
    plate:{
      required:"Placa es requerida",
      maxLength:"La placa no debe de superar los 10 caracteres",
    },
    vin:{
      maxLength:"El vin no debe de superar los 17 caracteres"      
    },
    year:{
      required:"Año es requerido",
      maxLength:"Año no debe superar 4 digitos"
    },
    mileage:{
      required:"Kilometraje es requerido",
      maxLength:"Kilometraje no debe superar los 6 digitos",
    }
  }

  constructor(
    private formsBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController:ModalController
  ) { }

  async ngOnInit() {
    this.createForm();

    if (this.isEdition) {
      await this.chargerVehicle();
    }
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  private createForm():void{

    this.vehicleForm = this.formsBuilder.group({
      model_id: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$')
      ]],
      fuel_id: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$')
      ]],
      color_id: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$')
      ]],
      plate:['',[
        Validators.required,
        Validators.maxLength(10)
      ]],
      vin:['',[
        Validators.maxLength(17),
      ]],
      year:['',[
        Validators.required,
        Validators.pattern('^[1-9][0-9]{3}$')
      ]],
      mileage:['',[
        Validators.required,
        Validators.pattern('^(0|[1-9]\\d{0,5})$'),
      ]],
    });
  }

  getError(controlName:string):string{
    const control = this.vehicleForm.get(controlName);

    if(!control || !control.errors || !(control.touched || control.dirty)){
      return '';
    }

    const typeError = Object.keys(control.errors)[0];

    return this.validatorsMessage[controlName]?.[typeError] ?? 'El valor ingresado no es valido';
  }

  async closeModal():Promise<void>{
    await this.modalController.dismiss({
      saved:false,
    });
  }

  async saveVehicle(): Promise<void>{
    if(this.vehicleForm.invalid){
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
      vin: values.vin?.trim() ?? '',
      year: Number(values.year),
      mileage: Number(values.mileage)
    }

    try {
      
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(
          `${environment.apiUrl}/vehicles/${this.id}`,
          vehicle,
          {
            headers:{
              'Content-Type':'application/json'
            },
          }
        );
      } else {
        await axios.post(
          `${environment.apiUrl}/vehicles`,
          vehicle,
          {
            headers:{
              'Content-Type':'application/json'
            },
          }
        );
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? "Vehiculo actualizado" : "Vehiculo guardado",
        message: this.isEdition ? "El vehiculo fue actualizado correctamente" : "El vehiculo fue guardado exitosamente",
        buttons: ['Aceptar']
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved:true
      });

    } catch (error) {
      console.log(this.isEdition ? "Error al actualizar vehiculo" : "Error al guardar vehiculo",error);

      const alert = await this.alertController.create({
        header:"Error",
        message: this.isEdition ? "No fue posible actualizar el vehiculo, Revisar los datos, la conexion o los permisos de directus" : "No fue posible guardar el vehiculo, Revisar los datos, la conexion o los permisos de directus",
        buttons:['Aceptar'],
      });

      await alert.present();
    }finally{
      this.saved = false;
    }
  }

  async chargerVehicle(): Promise<void>{
    if(this.id === undefined){
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: { id: number; model_id: number; fuel_id: number; color_id: number; plate: string; vin: string; year: number; mileage: number } }>(
        `${environment.apiUrl}/vehicles/${this.id}`,
      );

      const vehicle = response.data.data;

      this.vehicleForm.patchValue({
        model_id: vehicle.model_id,
        fuel_id: vehicle.fuel_id,
        color_id: vehicle.color_id,
        plate: vehicle.plate,
        vin: vehicle.vin,
        year: vehicle.year,
        mileage: vehicle.mileage,
      });
    } catch (error) {
      console.log("Error al cargar vehiculo",error);

      const alert = await this.alertController.create({
        header:"Error",
        message:"No fue posible cargar los datos del vehiculo, Revisar la conexion o los permisos de directus",
        buttons:['Aceptar'],
      });

      await alert.present();
    }finally{
      this.charging = false;
    }
  }

}