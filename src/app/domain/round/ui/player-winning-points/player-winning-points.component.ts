import { ChangeDetectionStrategy, Component, effect, ElementRef, input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-player-winning-points',
  standalone: true,
  templateUrl: './player-winning-points.component.html',
  styleUrls: ['./player-winning-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerWinningPointsComponent {
  public readonly totalSegments = input.required<number>(); // Gesamtanzahl der Segmente
  public readonly activeSegments = input.required<number>(); // Anzahl der farbigen Segmente

  @ViewChild('circle', { static: true })
  private readonly circle!: ElementRef;

  @ViewChild('backgroundCircle', { static: true })
  private readonly backgroundCircle!: ElementRef;

  public readonly _inputUpdate = effect(() => {
    this.totalSegments();
    this.activeSegments();
    this.updateStrikes();
  })

  public updateStrikes() {
    const radius = 50; // Radius des Kreises in SVG
    const totalCircumference = 2 * Math.PI * radius;
    const gapSize = 10; // Abstand zwischen den Segmenten
    const segmentSize = (totalCircumference - (this.totalSegments() * gapSize)) / this.totalSegments();

    // Erstelle den stroke-dasharray für den farbigen Ring
    const coloredDashArray = Array(this.activeSegments()).fill(`${segmentSize} ${gapSize}`).join(' ')
      + ` 0 ${totalCircumference - (this.activeSegments() * (segmentSize + gapSize))}`;

    // Erstelle den stroke-dasharray für den neutralen Ring
    const neutralDashArray = Array(this.totalSegments() - this.activeSegments()).fill(`${segmentSize} ${gapSize}`).join(' ')
      + ` 0 ${totalCircumference - ((this.totalSegments() - this.activeSegments()) * (segmentSize + gapSize + 0.1))}`;

    // Setze den Dashoffset, um den Startpunkt der farbigen Segmente nahe 12 Uhr zu platzieren
    const startOffset = totalCircumference / 4; // Startpunkt bei 12 Uhr

    this.circle.nativeElement.setAttribute('stroke-dasharray', coloredDashArray);
    this.circle.nativeElement.setAttribute('stroke-dashoffset', `${-startOffset}`);

    this.backgroundCircle.nativeElement.setAttribute('stroke-dasharray', neutralDashArray);
    this.backgroundCircle.nativeElement.setAttribute('stroke-dashoffset', `${-startOffset - this.activeSegments() * (segmentSize + gapSize)}`);
  }
}