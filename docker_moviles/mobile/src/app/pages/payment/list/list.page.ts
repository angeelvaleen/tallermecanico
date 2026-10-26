import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PaymentServices } from 'src/app/services/payments/payments';

interface Payment {
  id: number;
  quote_id: number;
  user_id: number;
  method_id:number;
  amount: number;
  reference: string;
  paid_at:string;
}

@Component({
  selector: 'app-payment-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage{
  payments: Payment[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 15;
  search: string = "";

  constructor(
    private paymentServices: PaymentServices,
  ) {}

  ionViewWillEnter() {
   void this.chargerData();
  }

  async loadPayments(): Promise<void> {
    try {
      this.payments = await firstValueFrom(this.paymentServices.list(this.currentPage,this.perPage,this.search));
    } catch (error) {
      console.log('Error al cargar pagos', error);
    }
  }


  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.paymentServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de pagos:", error);

      this.total = 0;
    }
  }

  private adjustCurrentPage(): void {
    const totalPages = Math.ceil(this.total / this.perPage);

    if (totalPages === 0) {
      this.currentPage = 1;
      return;
    }

    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }


  async chargerData(): Promise<void> {
    await this.chargerTotal();
    this.adjustCurrentPage();
    await this.loadPayments();
  }

 
  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadPayments();
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}