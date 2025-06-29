import { Component, OnInit } from '@angular/core'; // OnInit'i de ekleyelim
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit { // OnInit'i implement edelim

  public users: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  goBackToLogin(): void {
    this.router.navigate(['/login']);
  }

  getUsers(): void {
    this.dashboardService.getUsers().subscribe(data => {
      console.log("Servis aracılığıyla veri başarıyla çekildi:", data);
      this.users = data;
    });
  }
}
