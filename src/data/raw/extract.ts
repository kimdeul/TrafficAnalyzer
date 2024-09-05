import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { BusStop, Discrits, isValidDiscrits, isValidDong } from "../../types/BusStop";

const EXTRACTED_BUS_STOPS: BusStop[] = []

const csv = readFileSync(join(__dirname, '../../', 'source/busstops.csv'), "utf-8")
for (const lineSource of csv.split("\r\n").slice(1)) {

  const line = lineSource.split(",")
  const discrit = line[4]
  const dong = line[5]

  if (!isValidDiscrits(discrit)) continue;
  if (!isValidDong(dong)) continue;

  if (Number.isNaN(parseFloat(line[8]))) continue;
  if (discrit !== Discrits.BUPYEONG) continue;

  const busStop: BusStop = {
    name: line[1],
    number: parseInt(line[2]),
    id: parseInt(line[3]),
    discrit: discrit,
    dong: dong,
    x: parseFloat(line[6]),
    latitude: parseFloat(line[7]),
    y: parseFloat(line[8]),
    longitude: parseFloat(line[9]),
  }

  EXTRACTED_BUS_STOPS.push(busStop)

}

writeFileSync("src/data/raw/extracted.json", JSON.stringify(EXTRACTED_BUS_STOPS, null, 2))



