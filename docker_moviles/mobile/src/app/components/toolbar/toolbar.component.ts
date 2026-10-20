import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false,
})
export class ToolbarComponent  implements OnInit {

  @Input() name: string = '';
  @Input() color: string = 'primary';

  constructor() { }

  ngOnInit() {}

}
