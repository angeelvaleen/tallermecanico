import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit, OnDestroy {
  brand: Brand | null = null;
  cargando: boolean = true;
  mensajeError: string = '';
  private routeSub: Subscription | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Nos suscribimos para detectar cambios en el ID de la URL dinámicamente
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarDetalle(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  async cargarDetalle(id: string): Promise<void> {
    this.cargando = true;
    this.brand = null;

    try {
      const response = await axios.get(
        `${environment.apiUrl}/items/brands/${encodeURIComponent(id)}`
      );
      this.brand = response.data.data;
    } catch (error) {
      console.error('Error al cargar el detalle:', error);
      this.mensajeError = 'No se pudo cargar la información.';
    } finally {
      this.cargando = false;
    }
  }
}