import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';
import { BackArrowComponent } from '../../domain/layouts/ui/back-arrow/back-arrow.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { UpdatelogLoaderService } from '../../domain/updatelog/domain/services/updatelog-loader.service';
import { extractHeadings } from '../../domain/updatelog/domain/utils/heading-parser.utils';
import { TreeComponent } from '../../domain/tree/tree/tree.component';

@Component({
  selector: 'app-updatelog',
  standalone: true,
  imports: [
    BackArrowComponent,
    TitleComponent,
    RouterLink,
    TreeComponent
  ],
  templateUrl: './updatelog.component.html',
  styleUrl: './updatelog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatelogComponent { 
  private readonly _updateLogLoader = inject(UpdatelogLoaderService);
  private readonly _sanitizer = inject(DomSanitizer);
  
  private readonly markdownContentRaw = toSignal(
    this._updateLogLoader.loadMarkdown('assets/updates/update.md')
  );

  public readonly markdownContent = computed(() => {
    const raw = this.markdownContentRaw();
    if(raw === undefined) return '';
    return marked(raw);
  });

  public readonly headings = computed(() => {
    const markDown = this.markdownContentRaw();
    if(markDown === undefined) return;
    console.log(extractHeadings(markDown))
    return extractHeadings(markDown);
  })


}
