import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PaymentServices, Payment } from 'src/app/services/payments/payments';
import { AuthService } from 'src/app/services/auth/auth';


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
  userRole:string | null = null;

  constructor(
    private paymentServices: PaymentServices,
    private authService: AuthService,
  ) {}

  ngOnInit():void{
    this.userRole = this.authService.getRole();
  }

  ionViewWillEnter() {
   void this.chargerData();
  }

  async loadPayments(): Promise<void> {
    try {
      switch(this.userRole){
        case 'Administrator':
            this.payments = await firstValueFrom(this.paymentServices.list(this.currentPage,this.perPage,this.search));
          break;
        case 'client':
          this.payments = await firstValueFrom(this.paymentServices.getMyPayments(this.currentPage,this.perPage,this.search));
          break;
        
      }
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