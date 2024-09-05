import { hsl } from "color-convert"
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

function convert(x: number, y: number) {
  return [(x-MIN_X)/10, (MAX_Y-y)/10] as const
}

type Context = CanvasRenderingContext2D

function renderBusStop(ctx: Context, x: number, y: number, color?: string) {
  if (!ctx) return
  ctx.fillStyle = color ?? "#99a";
  const [cx, cy] = convert(x, y)
  ctx.fillRect(cx, cy, 8, 8)
}

function renderBusRoute(ctx: Context, route: BusRoute) {
  if (!ctx) return
  ctx.beginPath()
  for (const num of route.list) {
    const now = BUS_STOPS.find(e => e.number === num)
    if (!now) continue;
    renderBusStop(ctx, now.x, now.y, route.color + "33")
    const [x, y] = convert(now.x, now.y)
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = route.color + "55"
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.closePath()
}

export function renderWithBackground(ctx: Context, callback: () => void) {
  const background = new Image(); 
  const SIZE = 3820
  background.src = "img/incheon.png"
  background.onload = () => {
    ctx.drawImage(background, 0, -40, SIZE, SIZE)
    callback()
  };
}

export function renderRoutes(ctx: Context) {
  if (!ctx) return;
  renderWithBackground(ctx, () => {
    BUS_STOPS.map(bs => renderBusStop(ctx, bs.x, bs.y))
    BUS_ROUTES.map(route => renderBusRoute(ctx, route))
  })
}

export function renderGraph(ctx: Context) {
  if (!ctx) return;
  graphize()
  for (const foundFrom of BUS_STOPS) {
    for (const to of graph.get(`${foundFrom.number}`) ?? []) {
      ctx.beginPath()
      ctx.moveTo(...convert(foundFrom.x, foundFrom.y))
      const foundTo = BUS_STOPS.find(e => e.number === to.to)
      if (!foundTo) continue;
      const [x, y] = convert(foundTo.x, foundTo.y)
      ctx.lineTo(...convert(foundTo.x, foundTo.y))
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()
    }
  }
  BUS_STOPS.map(bs => renderBusStop(ctx, bs.x, bs.y, "#333"))
}
  
  
export function renderDistance(ctx: Context, start: number) {
  if (!ctx) return;
  const distances = dijkstra(start)
  const [x1, y1] = convert(BUS_STOPS[start].x, BUS_STOPS[start].y)
  for (let i=0; i<BUS_STOPS.length; i++) {
    ctx.fillStyle = distances[i] === Infinity ? "#000000" : "#" + hsl.hex([360 * Math.min(distances[i], 50000) / 50000, 100, 50]);
    const [cx, cy] = convert(BUS_STOPS[i].x, BUS_STOPS[i].y)
    ctx.fillRect(cx, cy, 8, 8)
  }
  console.log(distances)
  ctx.fillStyle = "#000"
  ctx.fillRect(x1, y1, 16, 16)
  ctx.fillStyle = "#FFF"
  ctx.fillRect(x1 + 2, y1 + 2, 12, 12)
}
  
  