import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  brands: any[] = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.cargarMarcas();
  }

  async cargarMarcas() {
    try {
      const response = await axios.get(`${environment.apiUrl}/items/brands`);
      this.brands = response.data.data;
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  }

  verDetalle(id: number, event: any) {
    if (event && event.target) {
      event.target.blur();
    }
    
    // navigateRoot ignora el historial de las pestañas y carga la vista completa
    this.navCtrl.navigateRoot(`/brands/detail/${id}`);
  }
}