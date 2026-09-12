import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface HistoryItem {
  id: number;
  vehicle_id: number;
  workorder_id: number;
  created_at: string;
}

@Component({
  selector: 'app-history-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  historyItem: HistoryItem | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerHistoryById(id);
    }
  }

  async chargerHistoryById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: HistoryItem }>(
        `${environment.apiUrl}/items/history/${id}`
      );
      this.historyItem = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de historial', error);
    }
  }
}