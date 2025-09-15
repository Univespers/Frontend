import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {}

  // Background theme
  private _backgroundThemeEvent = new BehaviorSubject<Theme>(Theme.Dark);

  public isBackgroundDark(): Observable<boolean> {
    return this._backgroundThemeEvent.pipe(map(value => {
      return (value == Theme.Dark);
    }));
  }
  public setBackgroundTheme(theme: Theme): void {
    this._backgroundThemeEvent.next(theme);
  }

}

export enum Theme {
  Dark, Light
}