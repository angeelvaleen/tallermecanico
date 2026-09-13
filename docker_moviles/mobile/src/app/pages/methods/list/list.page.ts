import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Method {
  id: number;
  name: string;
  is_active: boolean;
  created_at:string;
}

@Component({
  selector: 'app-methods-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  methods: Method[] = [];

  constructor() {}

  ngOnInit() {
    this.chargerMethods();
  }

  async chargerMethods(): Promise<void> {
    try {
      const response = await axios.get<{ data: Method[] }>(
        `${environment.apiUrl}/methods`
      );
      this.methods = response.data.data;
    } catch (error) {
      console.log('Error al cargar metodos', error);
    }
  }
}