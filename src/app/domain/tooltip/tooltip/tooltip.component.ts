import {Component, inject, OnInit, ViewContainerRef} from '@angular/core';

@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
    standalone: false
})
export class TooltipComponent implements OnInit {
  public readonly viewContainerRef = inject(ViewContainerRef);



  tooltip: string = '';
  left: number = 0;
  top: number = 0;

  constructor() {}

  ngOnInit(): void {}

}