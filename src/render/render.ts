import { hsl, hsv } from "color-convert"
import { BUS_ROUTES } from "../data/BusRoutes"
import { BUS_STOPS } from "../data/BusStops"
import { dijkstra, graph, graphize } from "../graph/graphize"
import { BusRoute } from "../types/BusRoute"
import { BusStop } from "../types/BusStop"

const [MIN_X, MIN_Y, MAX_X, MAX_Y] = Object.values(BUS_STOPS as BusStop[]).reduce((p, c) => {
  p[0] = Math.min(c.x, p[0])
  p[1] = Math.min(c.y, p[1])
  p[2] = Math.max(c.x, p[2])
  p[3] = Math.max(c.y, p[3])
  return p
}, [10000000000, 10000000000, 0, 0])


export class Renderer {

  private readonly ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  static convert(x: number, y: number) {
    return [(x-MIN_X)/5, (MAX_Y-y)/5 + 140] as const
  }

  renderBusStop(x: number, y: number, color?: string) {
    this.ctx.fillStyle = color ?? "#99a";
    const [cx, cy] = Renderer.convert(x, y)
    this.ctx.fillRect(cx, cy, 8, 8)
  }
  
  renderBusRoute(route: BusRoute) {
    this.ctx.beginPath()
    for (const num of route.list) {
      const now = BUS_STOPS.find(e => e.number === num)
      if (!now) continue;
      this.renderBusStop(now.x, now.y, route.color + "33")
      const [x, y] = Renderer.convert(now.x, now.y)
      this.ctx.lineTo(x, y)
    }
    this.ctx.strokeStyle = route.color + "55"
    this.ctx.lineWidth = 2
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
      BUS_STOPS.map(bs => this.renderBusStop(bs.x, bs.y))
      BUS_ROUTES.map(route => this.renderBusRoute(route))
    })
  }
  
  renderGraph() {
    graphize()
    for (const foundFrom of BUS_STOPS) {
      for (const to of graph.get(`${foundFrom.number}`) ?? []) {
        this.ctx.beginPath()
        this.ctx.moveTo(...Renderer.convert(foundFrom.x, foundFrom.y))
        const foundTo = BUS_STOPS.find(e => e.number === to.to)
        if (!foundTo) continue;
        const [x, y] = Renderer.convert(foundTo.x, foundTo.y)
        this.ctx.lineTo(...Renderer.convert(foundTo.x, foundTo.y))
        this.ctx.strokeStyle = "#aaaaaa50";
        this.ctx.lineWidth = 2
        this.ctx.stroke()
        this.ctx.closePath()
      }
    }
    BUS_STOPS.map(bs => this.renderBusStop(bs.x, bs.y, "#333"))
  }
    
    
  renderDistance(start: number) {
    const distances = dijkstra(start)
    const [x1, y1] = Renderer.convert(BUS_STOPS[start].x, BUS_STOPS[start].y)
    for (let i=0; i<BUS_STOPS.length; i++) {
      this.ctx.fillStyle = distances[i] === Infinity ? "#000000" : "#" + hsv.hex([360 * Math.min(distances[i], 20000) / 20000, 100, 50]);
      const [cx, cy] = Renderer.convert(BUS_STOPS[i].x, BUS_STOPS[i].y)
      this.ctx.fillRect(cx, cy, 8, 8)
    }
    this.ctx.fillStyle = "#000"
    this.ctx.fillRect(x1, y1, 16, 16)
    this.ctx.fillStyle = "#FFF"
    this.ctx.fillRect(x1 + 2, y1 + 2, 12, 12)
  }

  renderUsers() {
    BUS_STOPS.map(bs => this.renderBusStop(bs.x, bs.y, "#" + hsl.hex([250, 100, 100 * Math.min(1, bs.users.average / 3000)])))
  }
}
  
  