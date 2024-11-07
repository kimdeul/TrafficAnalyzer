import { hsl, hsv } from "color-convert"
import { BUS_ROUTES } from "../data/BusRoutes"
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops"
import { Point } from "../geometry/shapes/Point"
import { Segment } from "../geometry/shapes/Segment"
import { graph } from "../graph/graphize"
import { BusRoute } from "../types/BusRoute"
import { BusStop } from "../types/BusStop"

const [MIN_X, MIN_Y, MAX_X, MAX_Y] = BUS_STOP_ARRAY.reduce((p, c) => {
  p[0] = Math.min(c.x, p[0])
  p[1] = Math.min(c.y, p[1])
  p[2] = Math.max(c.x, p[2])
  p[3] = Math.max(c.y, p[3])
  return p
}, [10000000000, 10000000000, 0, 0])

type StyleOption = { size?: number, color?: string };

export class Renderer {

  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  private static convert(x: number, y: number) {
    return [40 + (x-MIN_X)/5, (MAX_Y-y)/5 + 140] as const
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  renderBusStop(stop: BusStop, color?: string, size?: number) {
    this.ctx.fillStyle = color ?? "#99a";
    const [cx, cy] = Renderer.convert(stop.x, stop.y)
    this.ctx.fillRect(cx - (size ?? 8) / 2, cy - (size ?? 8) / 2, size ?? 8, size ?? 8)
  }
  
  renderBusRoute(route: BusRoute) {
    this.ctx.beginPath()
    for (const num of route.list) {
      const now = BUS_STOPS[num]
      if (!now) continue;
      this.renderBusStop(now, route.color + "33")
      const [x, y] = Renderer.convert(now.x, now.y)
      this.ctx.lineTo(x, y)
    }
    this.ctx.strokeStyle = route.color + "ff"
    this.ctx.lineWidth = 5
    this.ctx.stroke()
    this.ctx.closePath()
  }
  
  renderWithBackground(callback: () => void) {
    const background = new Image(); 
    const SIZE = 1680
    background.src = "img/incheon.png"
    background.onload = () => {
      this.ctx.drawImage(background, 0, 0, SIZE, SIZE)
      callback()
    };
  }
  
  renderRoutes() {
    this.renderWithBackground(() => {
      BUS_STOP_ARRAY.map(bs => this.renderBusStop)
      BUS_ROUTES.map(route => this.renderBusRoute(route))
    })
  }
  
  renderGraph() {
    for (const foundFrom of BUS_STOP_ARRAY) {
      for (const to of graph[`${foundFrom.number}`] ?? []) {
        this.ctx.beginPath()
        this.ctx.moveTo(...Renderer.convert(foundFrom.x, foundFrom.y))
        const foundTo = BUS_STOPS[to.to]
        if (!foundTo) continue;
        const [x, y] = Renderer.convert(foundTo.x, foundTo.y)
        this.ctx.lineTo(...Renderer.convert(foundTo.x, foundTo.y))
        this.ctx.strokeStyle = "#aaaaaa50";
        this.ctx.lineWidth = 2
        this.ctx.stroke()
        this.ctx.closePath()
      }
    }
    BUS_STOP_ARRAY.map(bs => this.renderBusStop(bs, "#333"))
  }
    
    
  renderDistance(distances: { [key: string]: number }, start: string) {
    
    const [x1, y1] = Renderer.convert(BUS_STOPS[start].x, BUS_STOPS[start].y)

    for (const i of Object.keys(BUS_STOPS)) {
      this.ctx.fillStyle = distances[i] === Infinity ? "#000000" : "#" + hsv.hex([360 * Math.min(distances[i], 2400) / 2400, 100, 50]);
      const [cx, cy] = Renderer.convert(BUS_STOPS[i].x, BUS_STOPS[i].y)
      this.ctx.fillRect(cx - 4, cy - 4, 8, 8)
    }
    
    this.ctx.fillStyle = "#000"
    this.ctx.fillRect(x1, y1, 16, 16)
    this.ctx.fillStyle = "#FFF"
    this.ctx.fillRect(x1 + 2, y1 + 2, 12, 12)
  }

  renderUsers() {
    BUS_STOP_ARRAY.map(bs => this.renderBusStop(bs, "#" + hsl.hex([250, 100, 100 * Math.min(1, bs.users.average / 3000)])))
  }

  renderPoint(point: Point, fill?: StyleOption) {
    this.ctx.fillStyle = fill?.color ?? "#000"
    const size = fill?.size ?? 2
    this.ctx.fillRect(...Renderer.convert(point.x - size / 2, point.y - size / 2), size, size)
  }

  renderSegment(segment: Segment, stroke?: StyleOption) {
    this.ctx.beginPath()
    this.ctx.moveTo(...Renderer.convert(segment.from.x, segment.from.y))
    this.ctx.lineTo(...Renderer.convert(segment.to.x, segment.to.y))
    this.ctx.strokeStyle = stroke?.color ?? "#000"
    this.ctx.lineWidth = stroke?.size ?? 2
    this.ctx.stroke()
    this.ctx.closePath()
  }

  renderPolygon(points: Point[], option?: { fill?: StyleOption, stroke?: StyleOption }) {
    if (points.length < 3) return;
    this.ctx.beginPath()
    let prev = points[0], now = points[1]
    this.renderSegment(new Segment(prev, now), option?.stroke)
    for (const point of [...points.slice(1), points[0]]) {
      prev = now; now = point;
      this.renderSegment(new Segment(prev, now), option?.stroke)
    }
    for (const point of points) this.renderPoint(point, option?.fill)
  }

}
  
  