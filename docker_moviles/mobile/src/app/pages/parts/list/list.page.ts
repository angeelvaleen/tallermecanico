import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Part {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at:string;
}

@Component({
  selector: 'app-parts-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  parts: Part[] = [];

  constructor(
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.chargerParts();
  }

  async chargerParts(): Promise<void> {
    try {
      const response = await axios.get<{ data: Part[] }>(
        `${environment.apiUrl}/parts`
      );
      this.parts = response.data.data;
    } catch (error) {
      console.log('Error al cargar partes', error);
    }
  }

  async createPart(): Promise<void>{
      const modal = await this.modalController.create({
        component: FormPage,
        breakpoints: [0,0.5,0.95],
        initialBreakpoint: 0.95,
      });
  
      await modal.present();
  
      const { data } = await modal.onDidDismiss();
  
      if(data?.saved){
        await this.chargerParts();
      }
  
  }

  async abrirEditarModal(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: { id },
      breakpoints: [0,0.5,0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerParts();
    }
  }
  
}