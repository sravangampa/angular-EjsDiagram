import {
  Component,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  HostListener
} from "@angular/core";
import { DiagramComponent } from "@syncfusion/ej2-angular-diagrams";
import {
  NodeModel,
  Connector,
  SnapSettingsModel,
  PointModel
} from "@syncfusion/ej2-diagrams";
import { closest, Ajax } from "@syncfusion/ej2-base";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  //Diagram Properties
  @HostListener("mousemove", ["$event"]) onMouseMove(event) {
    // console.log('clientX:' +event.clientX);
    // console.log('clientY:' +event.clientY);
  }
  @ViewChild("diagram", null) public diagram: DiagramComponent;
  public nodes: NodeModel[] = [
    {
      offsetX: 100,
      offsetY: 100,
      width: 120,
      height: 60,
      //Sets type of the node as Image
      shape: { type: "HTML" }
    }
  ];

  public text: string = "Click";
  public size: string = "large";
  public nodeDefaults(node: NodeModel): NodeModel {
    let obj: NodeModel = {};
    if (obj.width === undefined) {
      obj.width = 145;
    } else {
      let ratio: number = 100 / obj.width;
      obj.width = 100;
      obj.height *= ratio;
    }
    obj.style = { fill: "#357BD2", strokeColor: "white" };
    obj.annotations = [{ style: { color: "white", fill: "transparent" } }];
    return obj;
  }
  public connDefaults(obj: Connector): void {
    if (obj.id.indexOf("connector") !== -1) {
      obj.type = "Orthogonal";
      obj.targetDecorator = { shape: "Arrow", width: 10, height: 10 };
    }
  }
  public interval: number[] = [
    1,
    9,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75
  ];

  public snapSettings: SnapSettingsModel = {
    horizontalGridlines: { lineColor: "#e0e0e0", lineIntervals: this.interval },
    verticalGridlines: { lineColor: "#e0e0e0", lineIntervals: this.interval }
  };
  public allowDragAndDrop: boolean = true;
  public productTeam1: Object[] = [
    {
      id: "t1",
      name: "ASP.NET MVC Team",
      expanded: true,
      child: [
        { id: "t2", pid: "t1", name: "Smith" },
        { id: "t3", pid: "t1", name: "Johnson" },
        { id: "t4", pid: "t1", name: "Anderson" }
      ]
    },
    {
      id: "t5",
      name: "Windows Team",
      expanded: true,
      child: [
        { id: "t6", pid: "t5", name: "Clark" },
        { id: "t7", pid: "t5", name: "Wright" },
        { id: "t8", pid: "t5", name: "Lopez" }
      ]
    }
  ];
  public field: Object = {
    dataSource: this.productTeam1,
    id: "id",
    text: "name",
    child: "child"
  };

  public onMouseOver(args: any): void {
    console.log("onMouseOver horizontalOffsetX:" + args.actualObject.offsetX);
    console.log("onMouseOver horizontalOffsetY:" + args.actualObject.offsetY);
    //console.log("onMouseOver verticalOffsetY:" + JSON.stringify(args.actualObject));
  }

  //onDragStop event
  public onDragStop(args: any): void {

    setTimeout(() =>{
    let targetEle: any = closest(args.target, ".e-droppable");
    targetEle = targetEle ? targetEle : args.target;
    console.log("targetEle OffsetX:" + targetEle.clientX);
    console.log("targetEle OffsetY:" + targetEle.clientY);
    console.log("OffsetX:" + args.event.clientX);
    console.log("OffsetY:" + args.event.clientY);

    // let mouseoverVal = this.diagram.mouseOver;
    // console.log("mouseoverVal:" + mouseoverVal.length);

    let zoom = this.diagram.scrollSettings.currentZoom;
    let horizontalOffset = this.diagram.scrollSettings.horizontalOffset;
    let verticalOffset = this.diagram.scrollSettings.verticalOffset;
    // check an target as diagram
    if (targetEle.classList.contains("e-diagram")) {
      let data: any = args.draggedNodeData.text;
      
      //add an node at runtime
      let draggedNode: NodeModel = {
        id: data,
        width: (8000 / zoom) * 0.01, 
        height: (4000 / zoom) * 0.01,
        offsetX: horizontalOffset + (args.event.clientX + -10) * zoom,
        offsetY: verticalOffset + (args.event.clientY - 310) * zoom,
        annotations: [{ content: data }],
        tooltip: {
          content:
            "X:" +
            horizontalOffset +
            (args.event.clientX + -10) * zoom +
            "Y:" +
            verticalOffset +
            (args.event.clientY - 310) * zoom
        }
      };

      this.diagram.add(draggedNode);
      args.clonedNode.remove();
    }

    // this.diagram.nodes[1].offsetX = args.event.clientX - 10;
    // this.diagram.nodes[1].offsetY = args.event.clientY - 310;
    //this.diagram.dataBind();

    console.log("Current Zoom:" + zoom);
    console.log("Current horizontalOffset:" + horizontalOffset);
    console.log("Current verticalOffset:" + verticalOffset);

    this.diagram.nodes.forEach(e => {
      console.log("diagram " + e.id + " node with OffsetX:" + e.offsetX);
      console.log("diagram " + e.id + " node with OffsetY:" + e.offsetY);
    });

    // const mousepoint: PointModel = this.diagram.getDiagramBounds().center;
    //  console.log("diagramX:" + mousepoint.x);
    //  console.log("diagramY:" + mousepoint.y);
  },200)
  }

  public saveDiagram(): void {
    let diagramData: string = this.diagram.saveDiagram();
    const callback: Ajax = new Ajax(
      "http://localhost:40895/Home/save",
      "POST",
      false,
      "application/json; charset=utf-8"
    );
    (callback.data = diagramData),
      (callback.onSuccess = (data: string): void => {});
    callback.send(JSON.stringify({ stringify: callback.data })).then();
  }

  public loadDiagram(): void {
    const callback: Ajax = new Ajax(
      "http://localhost:40895/Home/load",
      "POST",
      false,
      "application/json; charset=utf-8"
    );
    callback.onSuccess = (data: string): void => {
      this.diagram.loadDiagram(data);
    };
    callback.send();
  }

  ngAfterViewInit(): void {}
}
