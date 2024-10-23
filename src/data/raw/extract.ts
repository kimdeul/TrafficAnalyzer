import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { BusStop, Discrits, isValidDiscrits, isValidDong } from "../../types/BusStop";

const EXTRACTED_BUS_STOPS: { [key: string]: BusStop } = {}

const informations = readFileSync(join(__dirname, '../../', 'source/busstops.csv'), "utf-8").split("\r\n")
const users = readFileSync(join(__dirname, '../../', 'source/users.csv'), "utf-8").split("\r\n").map(line => line.split(","))
for (const lineSource of informations.slice(1)) {

  const line = lineSource.split(",")
  const discrit = line[4]
  const dong = line[5]

  if (!isValidDiscrits(discrit)) continue;
  if (!isValidDong(dong)) continue;

  if (Number.isNaN(parseFloat(line[8]))) continue;

  // 부평구 및 부평구 약간 외부에 있는 맞은편 정거장만 포함
  if (discrit !== Discrits.BUPYEONG && !["40001", "39460", "39484", "39489", "39491", "92059", "39495", "39493", "40063", "42024", "42023", "42511"].includes(line[2])) continue;
  // 부평구 내에 있어도 시내버스가 정차하지 않는 전용승강장은 제외, 연구 도중 폐지된 정거장 제외
  if (["40622", "40543", "40808", "40810", "40878", "40039", "40128", "40550", "40886", "40761"].includes(line[2])) continue;

  const busStop: BusStop = {
    name: line[1],
    number: line[2],
    id: parseInt(line[3]),
    discrit: discrit,
    dong: dong,
    x: parseFloat(line[6]),
    latitude: parseFloat(line[7]),
    y: parseFloat(line[8]),
    longitude: parseFloat(line[9]),
    users: {
      average: parseInt(users.find(s => s[1] === line[2])?.[7] ?? "0")
    }
  }

  EXTRACTED_BUS_STOPS[parseInt(line[2])] = busStop

}

console.log(Math.max(...Object.values(EXTRACTED_BUS_STOPS).map(e => e.users.average)))
writeFileSync("src/data/raw/extracted.json", JSON.stringify(EXTRACTED_BUS_STOPS, null, 2))



