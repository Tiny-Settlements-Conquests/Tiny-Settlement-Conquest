import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TreeNode } from '../heading.model';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  template: `
    <ul>
      <li *ngFor="let node of nodes()">
        <a [ngClass]="'h'+node.level" [href]="getFullUrl(node.id)">{{ node.text }}</a>
        <div *ngIf="node.children.length">
          <app-tree [nodes]="node.children"></app-tree>
        </div>
      </li>
    </ul>
  `,
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {
  private readonly _location = inject(Location);
 nodes = input.required<TreeNode[]>();

 getFullUrl(id: string): string {
  const currentPath = this._location.path(); // Hol dir den aktuellen Pfad
  return `${currentPath}#${id}`; // Füge die Überschrift-ID hinzu
  }
}
