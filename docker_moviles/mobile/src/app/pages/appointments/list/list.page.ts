import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

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
  selector: 'app-appointments-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  appointments: Appointment[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerAppointments();
  }

  async chargerAppointments(): Promise<void> {
    try {
      const response = await axios.get<{ data: Appointment[] }>(
        `${environment.apiUrl}/appointments`
      );
      
      this.appointments = response.data.data;
    } catch (error) {
      console.log('Error al cargar citas', error);
    }
  }
}