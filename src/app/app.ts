import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'untitled2';
}
