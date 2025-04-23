import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-button-popup-menu',
  standalone: true,
  imports: [],
  templateUrl: './button-popup-menu.component.html',
  styleUrl: './button-popup-menu.component.scss'
})
export class ButtonPopupMenuComponent {

  // The childs
  @ViewChild('contentContainer', { static: true }) contentContainer: ElementRef | undefined;

  stopEvent(event: any) {
    event.stopPropagation();
 }

  // Button text
  @Input() text: string = "";

  // Popup state
  isPopupShown = false;
  showPopup() {
    this.isPopupShown = true;
  }
  hidePopup() {
    this.isPopupShown = false;
  }
  togglePopup() {
    this.isPopupShown = !this.isPopupShown;
  }

}
