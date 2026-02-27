import { ChangeDetectionStrategy, Component, HostBinding, HostListener, input, output } from '@angular/core';

export type colors = 'yellow' | 'red' | 'brown';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent { 
  public readonly color = input.required<colors>()
  public readonly disabled = input<boolean>();

  public readonly clickEvent = output<Event>();

  @HostBinding('class')
  get hostClass(): string {
    return `${this.color()}`;  // Fügt die Klasse basierend auf dem color-Wert hinzu
  }

  @HostBinding('class.disabled')
  get isDisabled() {
    return this.disabled();
  }

  @HostListener('click', ['$event'])
  clickListener($event: Event) {
    if (this.disabled()) return;
    this.clickEvent.emit($event);
  }
}
