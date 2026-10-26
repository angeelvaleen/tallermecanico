import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { MethodServices, Method } from 'src/app/services/methods/methods';
import { FormPage } from '../form/form.page';


@Component({
  selector: 'app-methods-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  methods: Method[] = [];

  constructor(
    private modalController: ModalController,
    private methodService: MethodServices,
  ) {}

  ngOnInit(): void {
    this.loadMethods();
  }

  async loadMethods(): Promise<void> {
    try {
      this.methods = await firstValueFrom(this.methodService.listWithOutFilters());
    } catch (error) {
      console.error('Error al cargar métodos:', error);
    }
  }

  async createMethod(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadMethods();
    }
  }

  async editMethod(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadMethods();
    }
  }
}