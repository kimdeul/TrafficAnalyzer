import { v4 } from "uuid";
import { Segment } from "./Segment";
import { Shape } from "./Shape";

interface Location { x: number, y: number }

export class Point extends Shape {

  private location: Location;
  readonly id: string;

  constructor(location: Location, id?: number | string) {
    super()
    this.location = location;
    this.id = id ? `${id}` : v4();
  }

  get x() { return this.location.x }
  get y() { return this.location.y }

  is(point: Point) {
    return this.id === point.id;
  }

  lineTo(to: Point) {
    return new Segment(this, to)
  }

}