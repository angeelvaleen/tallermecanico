import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Appointment {
  id: number;
  vehicle_id: number;
  status_id: number;
  date: string;
  time: string;
  reason: string;
  created_at: string;
}

@Component({
  selector: 'app-appointments-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  appointment: Appointment | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerAppointmentById(id);
    }
  }

  async chargerAppointmentById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Appointment }>(
        `${environment.apiUrl}/items/appointments/${id}`
      );
      this.appointment = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de cita', error);
    }
  }
}