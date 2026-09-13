import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface History {
  id: number;
  vehicle_id: number;
  workorder_id: number;
  created_at: string;
}

@Component({
  selector: 'app-history-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  history: History[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerHistory();
  }

  async chargerHistory(): Promise<void> {
    try {
      const response = await axios.get<{ data: History[] }>(
        `${environment.apiUrl}/history`
      );
      this.history = response.data.data;
    } catch (error) {
      console.log('Error al cargar historial', error);
    }
  }
}