import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconsModule, provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIconsModule],
  providers: [provideIcons({ heroUsers }), provideNgIconsConfig({
    size: '1.5em',
  })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
