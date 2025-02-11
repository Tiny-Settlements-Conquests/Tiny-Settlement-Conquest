import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-3d-box',
  imports: [],
  templateUrl: './3d-box.component.html',
  styleUrl: './3d-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreeDBoxComponent { }
