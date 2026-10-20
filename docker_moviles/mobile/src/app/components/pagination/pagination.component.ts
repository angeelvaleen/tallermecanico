import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
  standalone: false,
})
export class PaginationComponent implements OnChanges {
  @Input() total: number = 0;
  @Input() perPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() maxVisiblePage: number = 5;
  @Output() changePage = new EventEmitter<number>();

  totalPages: number = 0;
  pageVisibles: number[] = [];

  constructor() {}

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.total / this.perPage);

    this.calculateVisiblesPages();
  }

  private calculateVisiblesPages(): void {
    if (this.totalPages === 0) {
      this.pageVisibles = [];
      return;
    }

    const middle = Math.floor(this.maxVisiblePage / 2);

    let start = Math.max(1, this.currentPage - middle);

    let end = Math.min(this.totalPages, start + this.maxVisiblePage - 1);

    start = Math.max(1, end - this.maxVisiblePage + 1);

    this.pageVisibles = [];

    for (let page = start; page <= end; page++) {
      this.pageVisibles.push(page);
    }
  }

  changerPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.changePage.emit(page);
  }

  before(): void {
    this.changerPage(this.currentPage - 1);
  }

  next(): void {
    this.changerPage(this.currentPage + 1);
  }
}
