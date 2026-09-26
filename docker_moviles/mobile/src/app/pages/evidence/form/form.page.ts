import {
  Component,
  Input,
  OnInit,
} from "@angular/core";

import {
  AlertController,
  ModalController,
} from "@ionic/angular";

@Component({
  selector: "app-evidence-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {

  @Input() workorderId?: number;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  ngOnInit() {}

  async closeModal(): Promise<void> {

    await this.modalController.dismiss({
      saved: false,
    });
  }

  async showPendingMessage(): Promise<void> {

    const alert =
      await this.alertController.create({

        header:
          "Evidencia",

        message:
          "La carga de imágenes se integrará con los archivos de Directus en el siguiente paso.",

        buttons: [
          "Aceptar",
        ],
      });

    await alert.present();
  }
}