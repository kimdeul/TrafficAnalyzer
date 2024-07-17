import { BUS_STOPS } from "./data/Data";
import { BusStop } from "./types/BusStop";

const [MIN_X, MIN_Y, MAX_X, MAX_Y] = Object.values(BUS_STOPS as BusStop[]).reduce((p, c) => {
  p[0] = Math.min(c.x, p[0])
  p[1] = Math.min(c.y, p[1])
  p[2] = Math.max(c.x, p[2])
  p[3] = Math.max(c.y, p[3])
  return p
}, [10000000000, 10000000000, 0, 0])

const get = document.getElementById.bind(document);
const canvas = get("graph")

console.log(MAX_X, MAX_Y, MIN_X, MIN_Y);

(() => {
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d")
  if (!ctx) return;

  const background = new Image(); 
  const SIZE = 3820
  background.src = "img/incheon.png"
  background.onload = () => {
    ctx.drawImage(background, 0, -40, SIZE, SIZE)
    function render(x: number, y: number) {
      if (!ctx) return
      ctx.fillStyle = "#00f";
      ctx.fillRect((x-MIN_X)/10, (MAX_Y-y)/10, 5, 5)
    }
  
    BUS_STOPS.map(b => render(b.x, b.y))
  }

})()

