import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PartServices, Part } from 'src/app/services/parts/parts';


@Component({
  selector: 'app-parts-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {

  part: Part | null = null;
  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private partServices: PartServices,
  ) {}

  ngOnInit(): void {
    this.loadPart();
  }

  async loadPart(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.messageError = 'No se proporcionó ID';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando refacción...',
      spinner: 'bubbles',
    });

    await loading.present();

    try {
      this.part = await firstValueFrom(this.partServices.detail(Number(id)));

    } catch (error) {

      this.messageError =
        'Revisar ID, conexión a base de datos o permisos';

      console.log(
        'Error al cargar detalle de refacción',
        error
      );

    } finally {
      await loading.dismiss();
    }
  }
}