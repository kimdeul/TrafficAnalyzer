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

  function convert(x: number, y: number) {
    return [(x-MIN_X)/10, (MAX_Y-y)/10]
  }

  function render(x: number, y: number, color?: string) {
    if (!ctx) return
    ctx.fillStyle = color ?? "#00f";
    const [cx, cy] = convert(x, y)
    ctx.fillRect(cx, cy, 8, 8)
  }

  const background = new Image(); 
  const SIZE = 3820

  const Line = [
    38472, 38319, 39919, 92019, 38380, 38403, 38446, 38720, 38395, 38698, 38561, 38593, 38738, 38745, 38641, 38630, 38655, 32062, 38668, 38624, 38666, 38645, 38635, 38633, 38715, 38734, 38621, 38528, 38515, 38417, 38492, 38459, 38482, 38462, 38463, 38464, 38545, 38589, 38015, 38026, 38034, 38349, 38023, 38016, 38419, 39929, 39861, 39850, 38770, 38778, 38622, 39931, 39858, 39725, 39938, 38420, 38017, 38024, 38032, 38033, 38025, 38014, 38426, 38544, 38455, 38456, 38457, 38480, 38555, 38588, 38415, 38514, 38619, 38620, 38733, 38716, 38632, 38634, 38650, 38665, 38642, 38667, 38643, 38751, 38656, 38657, 38744, 38739, 38592, 38578, 38712, 38396, 38646, 38447, 38404, 38373, 92020, 39918, 38513, 38472
  ]
  
  background.src = "img/incheon.png"
  background.onload = () => {
    ctx.drawImage(background, 0, -40, SIZE, SIZE)
    BUS_STOPS.map(b => render(b.x, b.y))

    ctx.beginPath()
    for (const num of Line) {
      const b = BUS_STOPS.find(e => e.number === num)
      if (!b) continue;
      render(b.x, b.y, "#f00")
      const [x, y] = convert(b.x, b.y)
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = "#f008"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()
  }

})()

