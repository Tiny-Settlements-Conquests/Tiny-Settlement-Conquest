import { Directive, ComponentRef, ElementRef, EmbeddedViewRef, HostListener, inject, input, TemplateRef, ViewContainerRef } from "@angular/core";
import { TooltipComponent } from "./tooltip/tooltip.component";

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  
  readonly tooltip = input<TemplateRef<unknown> | string>('');

  private componentRef: ComponentRef<TooltipComponent> | null = null;


  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.componentRef !== null) return;
    this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;       
    document.body.appendChild(domElem);
    this.setTooltipComponentProperties();
  }

  private setTooltipComponentProperties() {
    if (this.componentRef == null) return;
    const tooltipValue = this.tooltip();
    if (tooltipValue instanceof TemplateRef) {
      const embeddedView = this.componentRef.instance.viewContainerRef.createEmbeddedView(tooltipValue);
      this.componentRef.instance.tooltip = embeddedView;
    } else {
      this.componentRef.instance.tooltip = tooltipValue;
    }
    const {left, right, bottom} = this.elementRef.nativeElement.getBoundingClientRect();
    this.componentRef.instance.left = (right - left) / 2 + left;
    this.componentRef.instance.top = bottom;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.componentRef.destroy();
      this.componentRef = null;
      this.viewContainerRef.clear();
    }
  }
}