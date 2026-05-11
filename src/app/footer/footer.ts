import { Component , Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Output() subscribeClicked = new EventEmitter<void>();

  onSubscribeClick(): void {
    this.subscribeClicked.emit();
  }
}
