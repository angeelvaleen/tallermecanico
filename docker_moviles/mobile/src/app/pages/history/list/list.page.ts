import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth';

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

  loading: boolean = false;
  loadError: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.chargerHistory();
  }

  async chargerHistory(): Promise<void> {
    this.loading = true;
    this.loadError = false;

    try {
      const response = await axios.get<{ data: History[] }>(
        `${environment.apiUrl}/history`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      );
      this.history = response.data.data;
    } catch (error) {

      this.loadError = true;
    } finally {
      this.loading = false;
    }
  }

  async retry(): Promise<void> {
    await this.chargerHistory();
  }
}