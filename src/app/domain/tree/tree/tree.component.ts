import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from '../heading.model';

@Component({
    selector: 'app-tree',
    imports: [NgFor, NgIf, NgClass, FaIconComponent],
    template: `
    <ul>
        <li *ngFor="let node of nodes()">
          @if(node.children.length > 0) {
            <div *ngIf="node.children.length" class="flex gap-2 flex-row items-center">
              <a [ngClass]="'h'+node.level" [href]="getFullUrl(node.id)">{{ node.text }}</a>
              <fa-icon [icon]="chevron" (click)="toggleCollapse()">toggle</fa-icon>
            </div>
              @if(!collapse()) {
                <app-tree  [nodes]="node.children" />
              }
          } @else {
            <a [ngClass]="'h'+node.level" [href]="getFullUrl(node.id)">{{ node.text }}</a>
          }
        </li>
    </ul>
  `,
    styleUrl: './tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent {
  private readonly _location = inject(Location);
  nodes = input.required<TreeNode[]>();
  collapse = signal(false);

  public chevron = faChevronDown;

 getFullUrl(id: string): string {
  const currentPath = this._location.path(); // Hol dir den aktuellen Pfad
    return `${currentPath}#${id}`; // Füge die Überschrift-ID hinzu
  }

  toggleCollapse(): void {
    this.collapse.set(!this.collapse());
  }
}
