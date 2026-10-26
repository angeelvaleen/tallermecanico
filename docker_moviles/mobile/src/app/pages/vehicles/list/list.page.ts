import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormPage } from '../form/form.page';

import { firstValueFrom } from 'rxjs';
import { VehicleServices, Vehicle } from 'src/app/services/vehicles/vehicles';


@Component({
  selector: 'app-vehicles-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage {

  vehicles: Vehicle[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 15;
  search: string = "";

  constructor(
    private modalController: ModalController,
    private vehicleServices: VehicleServices,
  ) {}

  ionViewWillEnter(): void {
   void this.chargerData();
  }

  async loadVehicles(): Promise<void> {

    try {
      this.vehicles = await firstValueFrom(this.vehicleServices.list(this.currentPage,this.perPage,this.search));
    } catch (error) {

      console.log(
        'Error al cargar vehículos',
        error
      );
    }
  }

  async createVehicle(): Promise<void> {

    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadVehicles();
    }
  }

  async editVehicle(id: number): Promise<void> {

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
      await this.loadVehicles();
    }
  }

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.vehicleServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de servicios:", error);

      this.total = 0;
    }
  }

  private adjustCurrentPage(): void {
    const totalPages = Math.ceil(this.total / this.perPage);

    if (totalPages === 0) {
      this.currentPage = 1;
      return;
    }

    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }


  async chargerData(): Promise<void> {
    await this.chargerTotal();
    this.adjustCurrentPage();
    await this.loadVehicles();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadVehicles();
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }


}