import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule, // para usar FormControl
    MatFormFieldModule, // para <mat-form-field>
    MatInputModule, // para matInput
    MatAutocompleteModule, ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  searchControl = new FormControl('');
  ngOnInit(): void{}
}
