import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup-dialog',
  standalone: true,
  imports: [],
  templateUrl: './popup-dialog.component.html',
  styleUrl: './popup-dialog.component.scss'
})
export class PopupDialogComponent {

  // The childs
  @ViewChild('contentContainer', { static: true }) contentContainer: ElementRef | undefined;

  stopEvent(event: any) {
    event.stopPropagation();
 }

  // Popup state
  _show = false;
  @Input() set show(state: boolean) {
    this._show = state;
    this.showChange.emit(this._show);
  }
  get show(): boolean {
    return this._show;
  }
  @Output() showChange = new EventEmitter<boolean>(true);

  // Popup actions
  showPopup() {
    this.show = true;
  }
  hidePopup() {
    this.show = false;
  }
  togglePopup() {
    this.show = !this.show;
  }

}
