import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BpmnDiagramsService, DataBindingService, DiagramModule, HierarchicalTreeService, SnappingService } from '@syncfusion/ej2-angular-diagrams';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { AppComponent } from '../app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DiagramModule, TreeViewModule
  ],
  providers: [BpmnDiagramsService, DataBindingService, SnappingService, HierarchicalTreeService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
