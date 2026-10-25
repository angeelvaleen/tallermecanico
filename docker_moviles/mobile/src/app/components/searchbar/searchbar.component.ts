import { Component, EventEmitter ,OnInit,Input, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone: false,

})
export class SearchbarComponent  implements OnInit {
  @Input() value: string = '';
  @Input() placeholder: string = 'Buscar...';
  @Input() debounce: number = 300;

  @Output() changeText = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onInput(event: CustomEvent<{ value?: string | null }>): void {
    const text = event.detail.value ?? '';
    
    this.value = text;
    this.changeText.emit(text);
  }

}
