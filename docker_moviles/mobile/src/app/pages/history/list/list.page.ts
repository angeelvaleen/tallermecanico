import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface HistoryItem {
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
  historyItems: HistoryItem[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerHistory();
  }

  async chargerHistory(): Promise<void> {
    try {
      const response = await axios.get<{ data: HistoryItem[] }>(
        `${environment.apiUrl}/items/history`
      );
      this.historyItems = response.data.data;
    } catch (error) {
      console.log('Error al cargar historial', error);
    }
  }
}