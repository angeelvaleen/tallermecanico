import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface ColorCreate{
  name:string
}

@Component({
  selector: 'app-colors-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})


export class FormPage implements OnInit {

  colorForm!: FormGroup; 
  saved:boolean = false;

  validationMessage:Record<string,Record<string,string>> = {
    nombre:{
        required:"Nombre obligatorio",
        maxlenght:"El nombre no debe superar los 30 caracteres",
    }
  };

  constructor(
     private formsBuilder:FormBuilder,
     private alertController: AlertController,
     private modalController: ModalController,
  ){}

  ngOnInit() {
    this.createForm();
  }

  private createForm():void{

    this.colorForm = this.formsBuilder.group({
      name:['',[
       Validators.required,
       Validators.maxLength(30), 
      ]]
    });
  }

  getError(controlName:string):string{
    const control = this.colorForm.get(controlName);

    if(!control || !control.errors || !(control.touched || control.dirty)){
      return '';
    }

    const typeError = Object.keys(control.errors)[0];

    return this.validationMessage[controlName]?.[typeError] ?? 'El valor ingresado no es valido';
  }

  async closeModal():Promise<void>{
    await this.modalController.dismiss({
      saved:false,
    });
  }

  async saveColor(): Promise<void>{
    if(this.colorForm.invalid){
      this.colorForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.colorForm.value;

    const color: ColorCreate = {
      name: values.name.trim(),
    }

    try {
      
      await axios.post(
        `${environment.apiUrl}/colors`,
        color,
        {
          headers:{
            'Content-Type':'application/json'
          }
        }
      );

      const alert = await this.alertController.create({
        header: 'Color agregado',
        message: 'El color fue registrado correctamente',
        buttons: ['Aceptar'],
      })

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved:true
      });

    } catch (error) {
      console.log('Error al guardar color', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar color,Revisa los datos,la conexion y los permisos de creacion en directus'
      })

      await alert.dismiss();

    }finally{
      this.saved=false;
    }
  }

}
