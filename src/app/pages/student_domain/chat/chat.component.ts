import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { ColleagueEndpointService, ColleagueListResponse, ColleagueResponse } from '../../../endpoints/colleague-endpoint.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule, // para usar FormControl
    MatFormFieldModule, // para <mat-form-field>
    MatInputModule, // para matInput
    MatAutocompleteModule,
    CommonModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  searchControl = new FormControl('');
  filteredUsers$: Observable<ColleagueResponse[]> | undefined;

  constructor(private colleagueService: ColleagueEndpointService) {}

  ngOnInit(): void {
    // Quando o valor do input mudar, chamamos a API
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), // espera 300ms para não chamar a API a cada letra
      startWith(''),
      switchMap(value => this.searchUsers(value || ''))
    );
  }

  searchUsers(term: string): Observable<ColleagueResponse[]> {
    return this.colleagueService.searchColleagues(term, 1).pipe(
      map((res: ColleagueListResponse) => res.lista)
    );
  }
}
