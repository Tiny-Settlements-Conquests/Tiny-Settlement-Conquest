import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLayoutComponent { }
