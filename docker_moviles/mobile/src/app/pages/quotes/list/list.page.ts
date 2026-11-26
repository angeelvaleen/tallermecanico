import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { QuoteServices, Quote } from 'src/app/services/quotes/quotes';
import { FormPage } from '../form/form.page';

interface SavingQuote {
  workorder_id: number;
  user_id:number;
  status_id:number;
  subtotal:number;
  tax:number;
  total: number;
  validity: string;

}

@Component({
  selector: 'app-quotes-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage  {
  quotes: Quote[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 15;
  search: string = "";

  loading: boolean = false;
  loadError: boolean = false;

  constructor(
    private modalController:ModalController,
    private quoteServices: QuoteServices,
  ) {}

  ionViewWillEnter() {
    this.chargerData();
  }

  async loadQuotes(): Promise<void> {
    try {
      
      this.quotes = await firstValueFrom(this.quoteServices.list(this.currentPage,this.perPage,this.search))
    } catch (error) {

      this.loadError = true;
    }
  }

  async createQuote(): Promise<void>{
        const modal = await this.modalController.create({
          component: FormPage,
          breakpoints: [0,0.5,0.95],
          initialBreakpoint: 0.95,
        });
    
        await modal.present();
    
        const { data } = await modal.onDidDismiss();
    
        if(data?.saved){
          await this.loadQuotes();
        }
    }

    async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.quoteServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de cotizaciones:", error);

      this.total = 0;
      this.loadError = true;
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
    this.loading = true;
    this.loadError = false;

    try {
      await this.chargerTotal();
      this.adjustCurrentPage();
      await this.loadQuotes();
    } finally {
      this.loading = false;
    }
  }

  async retry(): Promise<void> {
    await this.chargerData();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    this.loading = true;
    this.loadError = false;

    try {
      await this.loadQuotes();
    } finally {
      this.loading = false;
    }
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}