import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" [attr.viewBox]="'0 0 ' + size() + ' ' + size()">
      <!-- Main Circle -->
      <circle
        [attr.cx]="center"
        [attr.cy]="center"
        [attr.r]="radius"
        fill="none"
        [attr.stroke]="backgroundColor()"
        [attr.stroke-width]="strokeWidth()"
        style="transform: rotate(-90deg); transform-origin: center center;"
      ></circle>

      <!-- Colored Segments -->
      <circle
        [attr.cx]="center"
        [attr.cy]="center"
        [attr.r]="radius"
        fill="none"
        [attr.stroke]="segmentColor()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="circumference + ' ' + circumference"
        [attr.stroke-dashoffset]="circumference - (circumference / totalSegments()) * filledSegments()"
        style="transform: rotate(-90deg); transform-origin: center center;"
      ></circle>

      <!-- Segment Dividers -->
      <circle
        [attr.cx]="center"
        [attr.cy]="center"
        [attr.r]="radius"
        fill="none"
        [attr.stroke]="backgroundColor()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="dividerDasharray"
        [attr.stroke-dashoffset]="dividerDashoffset"
        style="transform: rotate(-90deg); transform-origin: center center;"
      ></circle>
    </svg>
  `,
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleProgressComponent implements OnInit{
  public readonly size = input(62); // Size of the SVG
  public readonly strokeWidth = input(2.5); // Width of the circles
  public readonly totalSegments = input(5); // Total number of segments
  public readonly filledSegments = input(2); // Number of filled segments
  public readonly offset = input(0); // Segment offset
  public readonly backgroundColor = input('#EEEEEE'); // Background circle color
  public readonly segmentColor = input('#38bdf8'); // Color of the filled segments

  center!: number;
  radius!: number;
  circumference!: number;
  dividerDasharray!: string;
  dividerDashoffset!: number;

  ngOnInit(): void {
    this.center = this.size() / 2;
    this.radius = this.center - this.strokeWidth() / 2;
    this.circumference = 2 * Math.PI * this.radius;

    const segmentLength = this.circumference / this.totalSegments();
    this.dividerDasharray = `4 ${segmentLength - 4}`;
    this.dividerDashoffset = 2 + this.offset() * segmentLength;
  }
}