import { BUS_ROUTES } from "../data/BusRoutes"
import { BUS_STOPS } from "../data/BusStops"
import { BusRoute } from "../types/BusRoute"
import { BusStop } from "../types/BusStop"

const [MIN_X, MIN_Y, MAX_X, MAX_Y] = Object.values(BUS_STOPS as BusStop[]).reduce((p, c) => {
    p[0] = Math.min(c.x, p[0])
    p[1] = Math.min(c.y, p[1])
    p[2] = Math.max(c.x, p[2])
    p[3] = Math.max(c.y, p[3])
    return p
  }, [10000000000, 10000000000, 0, 0])

export function renderRoutes(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return;
  
    function convert(x: number, y: number) {
      return [(x-MIN_X)/10, (MAX_Y-y)/10]
    }
  
    function renderBusStop(x: number, y: number, color?: string) {
      if (!ctx) return
      ctx.fillStyle = color ?? "#99a";
      const [cx, cy] = convert(x, y)
      ctx.fillRect(cx, cy, 8, 8)
    }
  
    function renderBusRoute(route: BusRoute) {
      if (!ctx) return
      ctx.beginPath()
      for (const num of route.list) {
        const now = BUS_STOPS.find(e => e.number === num)
        if (!now) continue;
        renderBusStop(now.x, now.y, route.color + "33")
        const [x, y] = convert(now.x, now.y)
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = route.color + "55"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()
    }
  
    const background = new Image(); 
    const SIZE = 3820
    background.src = "img/incheon.png"
    background.onload = () => {
      ctx.drawImage(background, 0, -40, SIZE, SIZE)
      BUS_STOPS.map(bs => renderBusStop(bs.x, bs.y))
      BUS_ROUTES.map(route => renderBusRoute(route))
    }
  
}
  
  