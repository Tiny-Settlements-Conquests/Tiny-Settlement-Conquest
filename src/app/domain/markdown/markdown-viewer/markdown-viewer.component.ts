import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-markdown-viewer',
    imports: [
        CommonModule,
    ],
    templateUrl: './markdown-viewer.component.html',
    styleUrl: './markdown-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownViewerComponent { 
  public readonly markdownContent = input.required<string>()
}
