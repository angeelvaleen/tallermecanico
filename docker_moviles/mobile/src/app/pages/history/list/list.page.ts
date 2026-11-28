import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { History, HistoryServices } from 'src/app/services/history/history';

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

  constructor(private historyServices: HistoryServices) {}

  ngOnInit() {
    this.chargerHistory();
  }

  async chargerHistory(): Promise<void> {
    this.loading = true;
    this.loadError = false;

    try {
      this.history = await firstValueFrom(this.historyServices.list());
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
