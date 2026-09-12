import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Quote {
  id: number;
  workorder_id: number;
  total: number;
  validity: string;
}

@Component({
  selector: 'app-quotes-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  quotes: Quote[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerQuotes();
  }

  async chargerQuotes(): Promise<void> {
    try {
      const response = await axios.get<{ data: Quote[] }>(
        `${environment.apiUrl}/items/quotes`
      );
      this.quotes = response.data.data;
    } catch (error) {
      console.log('Error al cargar cotizaciones', error);
    }
  }
}