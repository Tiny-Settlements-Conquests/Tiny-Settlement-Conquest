import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-title',
    imports: [
        CommonModule,
    ],
    templateUrl: './title.component.html',
    styleUrl: './title.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent { }
