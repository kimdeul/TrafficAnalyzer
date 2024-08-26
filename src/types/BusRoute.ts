export const ROUTE_NUMBERS_BRANCH: string[] = [
  ..."인천e음11 인천e음12 인천e음13 인천e음15 인천e음16 인천e음21 인천e음22 506 510 1111 인천e음31 511 512 514-1 515 515-1 516 517 518 519 520 566".split(" "),
  ..."순환41 순환42 순환43 인천e음45 순환46 순환47 521 522 523 순환51 순환52 인천e음53 순환54 인천e음55 순환56 532 535 536 537 538 539 540".split(" "),
  ..."인천e음61 526 530 551 555 556 557 557A 558 560 561 562 564 564-1 565 567 568 569 570 571 574 579 인천e음71 581 582 583 584 584-1 585 586 587 588 590".split(" "),
  ..."순환83 인천e음84 인천e음85 인천e음86 인천e음88 인천e음89 591 592 593 594 595 596 701 702".split(" ")
] as const;

export const ROUTE_NUMBERS_MAINLINE: string[] = [
  ..."1 2 2-1 3-2 4 5 5-1 6 6-1 7 8 8A 9 10 11 12 13 14 14-1 15 16 16-1 17 20 21 22 23 24 24-1 26 27".split(" "),
  ..."28 28-1 29 30 33 34 35 36 37 38 42 43 43-1 44 45 46 47 55 58 62 63 65 65-1 66 67-1 70 71 72 75 76 77 78 79 80 81 82".split(" "),
  ..."86 87 92 93 103 103-1 111-2 112 202 202A 203 204 205 206 222 222A 223A".split(" ")
] as const;

export const ROUTE_NUMBERS_TOWN: string[] = [
  ..."무의1 533 534 중구1 중구3 중구4 중구5 중구5-1 중구5-2 중구5-4 중구5-5 중구6 중구6-1 중구7 중구8 계양1 계양2 대곡5".split(" ")
]

export const ROUTE_NUMBERS: string[] = [
  ...ROUTE_NUMBERS_BRANCH,
  ...ROUTE_NUMBERS_MAINLINE,
  ...ROUTE_NUMBERS_TOWN
]

export enum BusRouteColors {
  BRANCH = "#5bb025",
  MAINLINE = "#3366cc",
  TOWN = "#5ab025"
}

export interface BusRoute {
  number: string
  id: string
  list: number[]
  color: BusRouteColors
}