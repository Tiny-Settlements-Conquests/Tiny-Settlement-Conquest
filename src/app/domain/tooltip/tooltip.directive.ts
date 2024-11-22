import { Directive, Input, ComponentRef, ElementRef, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, HostListener, inject, TemplateRef, ViewContainerRef } from "@angular/core";
import { TooltipComponent } from "./tooltip/tooltip.component";

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  private readonly injector = inject(Injector);
  private readonly viewContainerRef = inject(ViewContainerRef);
  
  @Input() tooltip: TemplateRef<unknown> | string = '';

  private componentRef: ComponentRef<any> |null = null;


  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.componentRef !== null) return;
    const componentFactory =this.componentFactoryResolver.resolveComponentFactory(TooltipComponent);
    this.componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;       
    document.body.appendChild(domElem);
    this.setTooltipComponentProperties();
  }

  private setTooltipComponentProperties() {
    if (this.componentRef == null) return;
    if (this.tooltip instanceof TemplateRef) {
      // TemplateRef instanziieren und als View im TooltipComponent platzieren
      const embeddedView = this.componentRef.instance.viewContainerRef.createEmbeddedView(this.tooltip);
      this.componentRef.instance.tooltip = embeddedView;  // tooltipView sollte im TooltipComponent vorhanden sein
    } else {
      // Direkt den String Tooltip setzen
      this.componentRef.instance.tooltip = this.tooltip;
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
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
      this.viewContainerRef.clear();  // Löscht die eingebettete View, falls vorhanden
    }
  }
}