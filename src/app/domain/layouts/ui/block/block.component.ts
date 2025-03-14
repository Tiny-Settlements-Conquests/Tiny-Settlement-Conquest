import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-block',
    imports: [
        CommonModule,
    ],
    templateUrl: './block.component.html',
    styleUrl: './block.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockComponent { }
