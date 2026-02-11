import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error404.html',
  styleUrls: ['./error404.css']
})
export class Error404Component {}