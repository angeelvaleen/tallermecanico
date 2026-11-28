import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth';

export interface History {
  id: number;
  vehicle_id: number;
  workorder_id: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryServices {
  private url = environment.apiUrl + '/history';

  constructor(private authService: AuthService) {}

  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  list(): Observable<History[]> {
    return defer(() =>
      axios.get<{ data: History[] }>(this.url, this.getAuthConfig())
    ).pipe(map(response => response.data.data));
  }
}
