import { BUS_STOPS, extractBusStops } from "./data/extract";

extractBusStops()
console.log(Object.values(BUS_STOPS).reduce((p, c) => {
  p[0] = Math.min(c.x, p[0])
  p[1] = Math.min(c.y, p[1])
  p[2] = Math.max(c.x, p[2])
  p[3] = Math.max(c.y, p[3])
  return p
}, [10000000000, 10000000000, 0, 0]))

const get = document.getElementById
const canvas = get("canvas")

function render() {
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d")
  if (!ctx) return;
  ctx.fillStyle = "#000"
  ctx.fillRect(10, 10, 1, 1)
}

render()
