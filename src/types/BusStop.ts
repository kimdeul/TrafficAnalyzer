export enum Discrits {
  BUPYEONG = "부평구",
  GYEYANG = "계양구",
  SEO = "서구",
  YEONSU = "연수구",
  NAMDONG = "남동구",
  JUNG = "중구",
  DONG = "동구",
  GANGHWA = "강화군",
  ONGJIN = "옹진군",
  MICHUHOL = "미추홀구",
}

export type Dong = `${string}동`

export interface BusStop {
  readonly name: string;
  readonly number: number;
  readonly id: number;
  readonly discrit: Discrits;
  readonly dong: Dong;
  readonly x: number;
  readonly latitude: number;
  readonly y: number;
  readonly longitude: number;
  readonly users: {
    readonly average: number;
  }
}

export function isValidDiscrits(source: string): source is Discrits {
  return Object.values(Discrits).find(discrit => source === discrit) ? true : false
}

export function isValidDong(source: string): source is Dong {
  return source.endsWith("동")
}