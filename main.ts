// THE WORLD IN ONE DAY — Sunday 22 November 2026
// One-day newspaper poster. Stdlib only. Deterministic: no Date, no Math.random.
// Writes (MAKEFUN_OUTPUT_DIR || '/output') + '/entry.png'  (1024x1024 PNG)
import * as fs from "node:fs";
import * as zlib from "node:zlib";
import * as path from "node:path";

// ---------------------------------------------------------------- data
type Story = { headline: string; summary: string; region: string; field: string };

const LEADS: Story[] = [
  { headline: "TRUMP, XI AND PUTIN MEET IN SHENZHEN", summary: "The US, Chinese and Russian leaders hold a trilateral meeting in Shenzhen and agree to open talks on nuclear risk reduction, days after Washington tightens chip curbs.", region: "ASIA-PACIFIC", field: "DIPLOMACY" },
  { headline: "UKRAINE'S LARGEST AIR ATTACK OF THE YEAR", summary: "Russia fires 110 missiles and more than 400 drones; Zelenskyy calls Putin a 'killer' after Trump calls him a friend; a Russian missile violates Polish airspace.", region: "EUROPE", field: "CONFLICT" },
  { headline: "GULF IN FLAMES AS IRAN HITS BAHRAIN", summary: "Iran strikes a civilian industrial site in Bahrain; two tankers are hit near the Strait of Hormuz; Houthi missiles target Riyadh; oil holds near $90.", region: "MIDDLE EAST", field: "CONFLICT" },
];

const PICTURED: Story[] = [
  { headline: "COP31 TALKS DEADLOCK IN ANTALYA", summary: "Climate summit enters a second day of overtime as countries split over fossil fuels and finance for poorer nations.", region: "EUROPE", field: "CLIMATE" },
  { headline: "MEXICO CAPTURES 'EL CHAPO ISIDRO'", summary: "Special forces arrest cartel boss Fausto Isidro Meza Flores in Sinaloa; 11 die in the violence that follows.", region: "NORTH AMERICA", field: "JUSTICE" },
  { headline: "AI SELL-OFF PUSHES US STOCKS INTO CORRECTION", summary: "The S&P 500 and Dow fall into correction after a rout in AI and chip shares; Nvidia and AMD drop more than 13%.", region: "NORTH AMERICA", field: "MARKETS" },
  { headline: "LEEDS STUN CHELSEA 4-1", summary: "Noah Okafor scores twice as Leeds win at Stamford Bridge for the first time in 27 years.", region: "EUROPE", field: "FOOTBALL" },
  { headline: "MALEN SCORES FOUR AS ROMA ROUT PARMA 5-1", summary: "Donyell Malen hits four in Roma's biggest win of the season.", region: "EUROPE", field: "FOOTBALL" },
  { headline: "REAL MADRID 2-1 CELTA: ESPI'S 85TH-MINUTE WINNER", summary: "Bellingham and substitute Carlos Espi complete the comeback after Mbappe misses a penalty.", region: "EUROPE", field: "FOOTBALL" },
  { headline: "PERU QUAKE: 6.8 STRIKES JUNIN", summary: "A strong earthquake shakes Peru's Andean Junin region; 15 people injured, no deaths reported.", region: "SOUTH AMERICA", field: "DISASTERS" },
  { headline: "AI 'HELPED PROVE RIEMANN HYPOTHESIS'", summary: "An Anthropic researcher says AI assistance helped produce a proof of mathematics' most famous unsolved problem.", region: "NORTH AMERICA", field: "SCIENCE" },
  { headline: "BOLSONARO IN INTENSIVE CARE", summary: "Brazil's former president is in intensive care with a bowel obstruction.", region: "SOUTH AMERICA", field: "HEALTH" },
  { headline: "UN TALKS END WITH NO BAN ON 'KILLER ROBOTS'", summary: "Geneva talks on lethal autonomous weapons end without a binding treaty; work continues to 2028.", region: "GLOBAL", field: "DEFENCE" },
];

const BRIEFS: Story[] = [
  { headline: "", summary: "Sparta II, a Russian-linked cargo ship, catches fire in the Gulf of Finland after a suspected Ukrainian drone strike; crew evacuated.", region: "EUROPE", field: "DEFENCE" },
  { headline: "", summary: "Houthi forces fire three ballistic missiles at Riyadh; the Saudi-led coalition says all three were intercepted.", region: "MIDDLE EAST", field: "CONFLICT" },
  { headline: "", summary: "Russia hits Kryvyi Rih, Zelenskyy's hometown, with a ballistic missile; two killed, dozens wounded.", region: "EUROPE", field: "CONFLICT" },
  { headline: "", summary: "Moldova reports suspected Russian airspace violations a day after missiles flew over its territory.", region: "EUROPE", field: "DEFENCE" },
  { headline: "", summary: "Denmark urges the EU to curb visas for Russians after police foil an alleged plot to kill a US-Ukrainian rapper.", region: "EUROPE", field: "MIGRATION" },
  { headline: "", summary: "EU pledges 1 billion euros more in military aid for Ukraine.", region: "EUROPE", field: "DEFENCE" },
  { headline: "", summary: "PSG's Desire Doue suffers a serious knee injury in the 3-2 win at Nice.", region: "EUROPE", field: "FOOTBALL" },
  { headline: "", summary: "Netanyahu urges the US to approve new strikes on Iran, sources say.", region: "MIDDLE EAST", field: "POLITICS" },
  { headline: "", summary: "Four Palestinians killed and 14 hurt in Israeli ceasefire violations across Gaza.", region: "MIDDLE EAST", field: "CONFLICT" },
  { headline: "", summary: "Fire at Iraq's Hartha power station near Basra kills at least four and injures 35.", region: "MIDDLE EAST", field: "DISASTERS" },
  { headline: "", summary: "Toxic alcohol kills at least 11 in India's Manipur state; more than 180 hospitalised.", region: "ASIA-PACIFIC", field: "HEALTH" },
  { headline: "", summary: "Florida's St Johns River breaks a 73-year record as floods swamp towns from Miami to Brevard.", region: "NORTH AMERICA", field: "ENVIRONMENT" },
  { headline: "", summary: "US lawmakers push to ban Chinese-made AI models from federal systems.", region: "NORTH AMERICA", field: "TECHNOLOGY" },
  { headline: "", summary: "Google folds Duplex into Gemini App Tasks so it can call businesses for users.", region: "NORTH AMERICA", field: "AI" },
  { headline: "", summary: "AWS launches a distributed KV-cache skill to cut self-hosted LLM costs by up to 40%.", region: "NORTH AMERICA", field: "AI" },
  { headline: "", summary: "FinCEN names crypto exchange MEXC a primary money-laundering concern; Binance says it may freeze MEXC deposits.", region: "NORTH AMERICA", field: "CRYPTO" },
  { headline: "", summary: "Jailed FTX founder Sam Bankman-Fried gives an 82-minute prison interview to a 14-year-old podcaster.", region: "NORTH AMERICA", field: "MEDIA" },
  { headline: "", summary: "Binance founder CZ talks AI, compliance and Japan's crypto tax reform in a Japan interview.", region: "ASIA-PACIFIC", field: "CRYPTO" },
  { headline: "", summary: "Singapore plans a 'know-your-agent' verification protocol for AI agents and a stablecoin payments sandbox.", region: "ASIA-PACIFIC", field: "TECHNOLOGY" },
  { headline: "", summary: "Anthropic shares fall 8.5% on their first full day of trading after a record $81.3bn Nasdaq debut.", region: "NORTH AMERICA", field: "MARKETS" },
  { headline: "", summary: "JPMorgan says attackers hit third-party vendors and may have taken customer names and emails.", region: "NORTH AMERICA", field: "CYBERSECURITY" },
  { headline: "", summary: "FBI said to be examining an apparent breach of its crime database.", region: "NORTH AMERICA", field: "CYBERSECURITY" },
  { headline: "", summary: "US judge blocks Trump's plan to reshape the $4bn homeless aid programme.", region: "NORTH AMERICA", field: "LAW" },
  { headline: "", summary: "Trump threatens 'tremendous penalties' for US tech firms building AI data centres abroad.", region: "NORTH AMERICA", field: "POLITICS" },
  { headline: "", summary: "Spain extends its bank levy to 2027 to raise 1.4bn euros for protected housing before a snap election.", region: "EUROPE", field: "ECONOMY" },
  { headline: "", summary: "SoftBank's Masayoshi Son explored a roughly $1tn buyout of SK Hynix, then shelved it.", region: "ASIA-PACIFIC", field: "ECONOMY" },
  { headline: "", summary: "Traders price in a near-certain Fed quarter-point rate rise in December.", region: "NORTH AMERICA", field: "ECONOMY" },
  { headline: "", summary: "EU and Indonesia sign a trade deal after ten years of talks.", region: "GLOBAL", field: "TRADE" },
  { headline: "", summary: "South Korea's leader repeats a $75,000 reward for reporting academic dishonesty.", region: "ASIA-PACIFIC", field: "EDUCATION" },
  { headline: "", summary: "Oil holds near $90 a barrel as Hormuz tensions bite.", region: "MIDDLE EAST", field: "ENERGY" },
  { headline: "", summary: "London City Lionesses stay in the WSL title race with a 6-2 win over Crystal Palace.", region: "EUROPE", field: "SPORT" },
  { headline: "", summary: "Former South African deputy president Phumzile Mlambo-Ngcuka dies aged 71.", region: "AFRICA", field: "POLITICS" },
  { headline: "", summary: "Croatians rally in Zagreb demanding accountability over a psychiatric hospital incident.", region: "EUROPE", field: "SOCIETY" },
];

const TIMELINE = [
  { band: "00-06 UTC", text: "Overnight: Russia's largest air attack of the year hits Ukraine; Leeds stun Chelsea 4-1; Real Madrid beat Celta 2-1; Roma rout Parma 5-1." },
  { band: "06-12 UTC", text: "Morning: Mexico captures 'El Chapo Isidro'; COP31 enters a second day of overtime; Trump, Xi and Putin meet in Shenzhen." },
  { band: "12-18 UTC", text: "Afternoon: Houthi missiles fired at Riyadh; Iran strikes a site in Bahrain; two tankers hit near the Strait of Hormuz." },
  { band: "18-24 UTC", text: "Evening: Peru quake strikes Junin; UN talks end with no ban on 'killer robots'; AI said to help prove the Riemann hypothesis." },
];

// ---------------------------------------------------------------- canvas
const W = 1024, H = 1024;
const buf = new Uint8Array(W * H * 4);
type RGB = [number, number, number];
const PAPER: RGB = [247, 243, 232];
const INK: RGB = [17, 17, 17];
const RED: RGB = [185, 28, 28];
const BLUE: RGB = [30, 58, 95];
const GREY: RGB = [120, 116, 108];
const LIGHT: RGB = [232, 227, 214];
const WHITE: RGB = [255, 255, 255];
const SKY: RGB = [178, 205, 226];
const SEA: RGB = [58, 110, 150];
const GREEN: RGB = [46, 125, 70];
const GOLD: RGB = [201, 162, 39];
const DARKBLUE: RGB = [16, 32, 64];

function setPx(x: number, y: number, c: RGB): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
}
function fillRect(x: number, y: number, w: number, h: number, c: RGB): void {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) setPx(xx, yy, c);
}
function rectOutline(x: number, y: number, w: number, h: number, c: RGB): void {
  fillRect(x, y, w, 1, c); fillRect(x, y + h - 1, w, 1, c);
  fillRect(x, y, 1, h, c); fillRect(x + w - 1, y, 1, h, c);
}
function line(x0: number, y0: number, x1: number, y1: number, c: RGB): void {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (let n = 0; n < 4000; n++) {
    setPx(x, y, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}
function circle(cx: number, cy: number, r: number, c: RGB): void {
  for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++)
    if (xx * xx + yy * yy <= r * r) setPx(cx + xx, cy + yy, c);
}
function circleOutline(cx: number, cy: number, r: number, c: RGB): void {
  for (let a = 0; a < 360; a += 2) {
    const t = (a * Math.PI) / 180;
    setPx(Math.round(cx + r * Math.cos(t)), Math.round(cy + r * Math.sin(t)), c);
  }
}

// ---------------------------------------------------------------- 5x7 font
const GLYPHS: Record<string, string[]> = {
  A: ["01110","10001","10001","11111","10001","10001","10001"],
  B: ["11110","10001","10001","11110","10001","10001","11110"],
  C: ["01110","10001","10000","10000","10000","10001","01110"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  F: ["11111","10000","10000","11110","10000","10000","10000"],
  G: ["01110","10001","10000","10111","10001","10001","01111"],
  H: ["10001","10001","10001","11111","10001","10001","10001"],
  I: ["01110","00100","00100","00100","00100","00100","01110"],
  J: ["00111","00010","00010","00010","00010","10010","01100"],
  K: ["10001","10010","10100","11000","10100","10010","10001"],
  L: ["10000","10000","10000","10000","10000","10000","11111"],
  M: ["10001","11011","10101","10101","10001","10001","10001"],
  N: ["10001","11001","10101","10011","10001","10001","10001"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
  P: ["11110","10001","10001","11110","10000","10000","10000"],
  Q: ["01110","10001","10001","10001","10101","10010","01101"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  S: ["01111","10000","10000","01110","00001","00001","11110"],
  T: ["11111","00100","00100","00100","00100","00100","00100"],
  U: ["10001","10001","10001","10001","10001","10001","01110"],
  V: ["10001","10001","10001","10001","10001","01010","00100"],
  W: ["10001","10001","10001","10101","10101","11011","10001"],
  X: ["10001","10001","01010","00100","01010","10001","10001"],
  Y: ["10001","10001","01010","00100","00100","00100","00100"],
  Z: ["11111","00001","00010","00100","01000","10000","11111"],
  "0": ["01110","10001","10011","10101","11001","10001","01110"],
  "1": ["00100","01100","00100","00100","00100","00100","01110"],
  "2": ["01110","10001","00001","00110","01000","10000","11111"],
  "3": ["11111","00010","00100","00010","00001","10001","01110"],
  "4": ["00010","00110","01010","10010","11111","00010","00010"],
  "5": ["11111","10000","11110","00001","00001","10001","01110"],
  "6": ["00110","01000","10000","11110","10001","10001","01110"],
  "7": ["11111","00001","00010","00100","01000","01000","01000"],
  "8": ["01110","10001","10001","01110","10001","10001","01110"],
  "9": ["01110","10001","10001","01111","00001","00010","01100"],
  ".": ["00000","00000","00000","00000","00000","01100","01100"],
  ",": ["00000","00000","00000","00000","01100","00100","01000"],
  ":": ["00000","01100","01100","00000","01100","01100","00000"],
  ";": ["00000","01100","01100","00000","01100","00100","01000"],
  "!": ["00100","00100","00100","00100","00100","00000","00100"],
  "?": ["01110","10001","00001","00110","00100","00000","00100"],
  "'": ["00100","00100","01000","00000","00000","00000","00000"],
  '"': ["01010","01010","01010","00000","00000","00000","00000"],
  "(": ["00010","00100","01000","01000","01000","00100","00010"],
  ")": ["01000","00100","00010","00010","00010","00100","01000"],
  "-": ["00000","00000","00000","01110","00000","00000","00000"],
  "/": ["00001","00010","00010","00100","01000","01000","10000"],
  "%": ["11001","11010","00010","00100","01000","01011","10011"],
  "&": ["01100","10010","10100","01000","10101","10010","01101"],
  "+": ["00000","00100","00100","11111","00100","00100","00000"],
  "=": ["00000","00000","11111","00000","11111","00000","00000"],
  "$": ["00100","01111","10100","01110","00101","11110","00100"],
  "#": ["01010","01010","11111","01010","11111","01010","01010"],
  "*": ["00000","10101","01110","11111","01110","10101","00000"],
  " ": ["00000","00000","00000","00000","00000","00000","00000"],
};
const CHAR_W = (s: number) => 6 * s; // 5px glyph + 1px gap, scaled
function textWidth(t: string, s: number): number {
  return t.length * CHAR_W(s) - s;
}
function drawText(x: number, y: number, t: string, s: number, c: RGB): void {
  const up = t.toUpperCase();
  let cx = x;
  for (const ch of up) {
    const g = GLYPHS[ch] || GLYPHS[" "];
    for (let r = 0; r < 7; r++) for (let col = 0; col < 5; col++) {
      if (g[r][col] === "1") fillRect(cx + col * s, y + r * s, s, s, c);
    }
    cx += CHAR_W(s);
  }
}
function drawTextCentered(cx: number, y: number, t: string, s: number, c: RGB): void {
  drawText(cx - Math.floor(textWidth(t, s) / 2), y, t, s, c);
}
function wrapLines(t: string, s: number, maxW: number): string[] {
  const words = t.toUpperCase().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (textWidth(trial, s) <= maxW || !cur) cur = trial;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}
// Draw wrapped text; returns y just below last line.
function drawWrapped(x: number, y: number, t: string, s: number, c: RGB, maxW: number, lineH?: number): number {
  const lh = lineH ?? 7 * s + 2 * s;
  const lines = wrapLines(t, s, maxW);
  lines.forEach((ln, i) => drawText(x, y + i * lh, ln, s, c));
  return y + lines.length * lh;
}
// Brief: tag in red on first line, rest ink. Returns y below.
function drawBrief(x: number, y: number, st: Story, maxW: number): number {
  const tag = st.region + " - " + st.field + ": ";
  const full = tag + st.summary;
  const lines = wrapLines(full, 1, maxW);
  lines.forEach((ln, i) => {
    if (i === 0) {
      const tagPart = ln.slice(0, Math.min(tag.length, ln.length));
      drawText(x, y, tagPart, 1, RED);
      drawText(x + textWidth(tagPart, 1) + 1, y, ln.slice(tagPart.length), 1, INK);
    } else {
      drawText(x, y + i * 9, ln, 1, INK);
    }
  });
  return y + lines.length * 9;
}

// ---------------------------------------------------------------- pictures
function picFlags(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, SKY);
  fillRect(x, y + h - 14, w, 14, GREEN);
  const cols: RGB[] = [RED, WHITE, BLUE];
  for (let i = 0; i < 3; i++) {
    const px = x + 24 + i * Math.floor((w - 48) / 2);
    fillRect(px, y + 8, 3, h - 22, INK);
    fillRect(px + 3, y + 8, 34, 20, cols[i]);
    if (i === 1) fillRect(px + 3, y + 8, 34, 4, RED);
    if (i === 2) { fillRect(px + 3, y + 8, 8, 20, RED); fillRect(px + 29, y + 8, 8, 20, RED); }
  }
  // handshake: two clasped hands as interlocked blocks, with shirt cuffs
  fillRect(x + Math.floor(w / 2) - 44, y + h - 36, 18, 16, BLUE);
  fillRect(x + Math.floor(w / 2) + 26, y + h - 36, 18, 16, RED);
  fillRect(x + Math.floor(w / 2) - 26, y + h - 34, 52, 12, [222, 184, 135]);
  fillRect(x + Math.floor(w / 2) - 26, y + h - 34, 26, 12, [198, 158, 110]);
  line(x + Math.floor(w / 2) - 14, y + h - 34, x + Math.floor(w / 2) - 2, y + h - 22, INK);
  line(x + Math.floor(w / 2) + 2, y + h - 34, x + Math.floor(w / 2) + 14, y + h - 22, INK);
}
function picSkyline(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, DARKBLUE);
  circle(x + w - 30, y + 16, 9, [240, 230, 180]);
  const bw = Math.floor(w / 6);
  for (let i = 0; i < 6; i++) {
    const bh = 26 + ((i * 17) % 34);
    fillRect(x + 4 + i * bw, y + h - 12 - bh, bw - 6, bh + 12, INK);
    for (let wy = 0; wy < 3; wy++) for (let wx = 0; wx < 2; wx++)
      if ((i + wx + wy) % 2 === 0) fillRect(x + 8 + i * bw + wx * 10, y + h - 8 - bh + wy * 10, 4, 4, GOLD);
  }
  line(x + 20, y + 8, x + 90, y + h - 30, [255, 200, 80]);
  line(x + 60, y + 4, x + 150, y + h - 40, [255, 220, 120]);
  line(x + 110, y + 10, x + 200, y + h - 26, [255, 200, 80]);
  circle(x + 90, y + h - 30, 3, [255, 220, 120]);
}
function picTanker(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, SKY);
  fillRect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), SEA);
  // smoke
  circle(x + Math.floor(w * 0.68), y + 14, 10, GREY);
  circle(x + Math.floor(w * 0.75), y + 20, 12, [150, 146, 138]);
  circle(x + Math.floor(w * 0.60), y + 22, 8, GREY);
  // hull + deck
  fillRect(x + 14, y + Math.floor(h * 0.52), w - 28, 16, RED);
  fillRect(x + 14, y + Math.floor(h * 0.52) + 16, w - 28, 6, INK);
  fillRect(x + Math.floor(w * 0.62), y + Math.floor(h * 0.52) - 18, 22, 18, WHITE);
  fillRect(x + Math.floor(w * 0.62) + 6, y + Math.floor(h * 0.52) - 26, 10, 8, INK);
  line(x + 20, y + h - 6, x + w - 20, y + h - 6, WHITE);
  line(x + 30, y + h - 12, x + w - 40, y + h - 12, [200, 220, 235]);
}
function picGlobe(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, LIGHT);
  const cx = x + Math.floor(w / 2), cy = y + Math.floor(h / 2), r = Math.floor(h / 2) - 4;
  circle(cx, cy, r, SEA);
  circle(cx - 8, cy - 6, 9, GREEN); circle(cx + 10, cy + 8, 8, GREEN); circle(cx + 6, cy - 12, 6, GREEN);
  circleOutline(cx, cy, r, INK);
  line(cx - r, cy, cx + r, cy, [255, 255, 255]);
  // small flags around
  fillRect(x + 6, y + 6, 3, 16, INK); fillRect(x + 9, y + 6, 14, 8, RED);
  fillRect(x + w - 23, y + 6, 3, 16, INK); fillRect(x + w - 20, y + 6, 14, 8, BLUE);
  fillRect(x + 6, y + h - 22, 3, 16, INK); fillRect(x + 9, y + h - 22, 14, 8, GREEN);
  fillRect(x + w - 23, y + h - 22, 3, 16, INK); fillRect(x + w - 20, y + h - 22, 14, 8, GOLD);
}
function picBadge(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, DARKBLUE);
  circle(x + Math.floor(w / 2), y + Math.floor(h / 2), 20, GOLD);
  circleOutline(x + Math.floor(w / 2), y + Math.floor(h / 2), 20, INK);
  circle(x + Math.floor(w / 2), y + Math.floor(h / 2), 9, BLUE);
  fillRect(x + Math.floor(w / 2) - 1, y + Math.floor(h / 2) - 6, 3, 12, WHITE);
  fillRect(x + Math.floor(w / 2) - 6, y + Math.floor(h / 2) - 1, 13, 3, WHITE);
  // flashing lights
  circle(x + 16, y + 12, 6, RED); circle(x + w - 16, y + 12, 6, BLUE);
  line(x + 8, y + h - 10, x + w - 8, y + h - 10, WHITE);
}
function picChart(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, WHITE);
  line(x + 10, y + 8, x + 10, y + h - 10, INK);
  line(x + 10, y + h - 10, x + w - 8, y + h - 10, INK);
  line(x + 14, y + 14, x + 50, y + 22, RED);
  line(x + 50, y + 22, x + 86, y + 20, RED);
  line(x + 86, y + 20, x + 120, y + 40, RED);
  line(x + 120, y + 40, x + w - 14, y + h - 16, RED);
  fillRect(x + w - 52, y + 8, 34, 22, INK);
  for (let i = 0; i < 3; i++) fillRect(x + w - 48 + i * 9, y + 12, 5, 14, GOLD);
  drawText(x + 14, y + h - 22, "-13%", 1, RED);
}
function picStadium(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, GREEN);
  fillRect(x, y, w, Math.floor(h * 0.42), [90, 90, 100]);
  for (let i = 0; i < 8; i++) fillRect(x + 8 + i * 22, y + 8, 14, 10, i % 2 ? WHITE : RED);
  fillRect(x, y + Math.floor(h * 0.42), w, 3, WHITE);
  circle(x + Math.floor(w / 2), y + Math.floor(h * 0.72), 11, WHITE);
  circleOutline(x + Math.floor(w / 2), y + Math.floor(h * 0.72), 11, INK);
  fillRect(x + Math.floor(w / 2) - 2, y + Math.floor(h * 0.72) - 2, 4, 4, INK);
  line(x, y + h - 8, x + w, y + h - 8, WHITE);
}
function picBoot(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, LIGHT);
  fillRect(x, y + h - 16, w, 16, GREEN);
  // boot: tall leg on the left, foot pointing right, black sole
  fillRect(x + 22, y + h - 60, 26, 28, RED);
  fillRect(x + 22, y + h - 44, 92, 12, RED);
  fillRect(x + 22, y + h - 32, 96, 5, INK);
  for (let i = 0; i < 4; i++) fillRect(x + 30 + i * 5, y + h - 56, 3, 3, WHITE);
  line(x + 114, y + h - 40, x + 138, y + h - 50, INK);
  line(x + 114, y + h - 34, x + 138, y + h - 44, INK);
  circle(x + 152, y + h - 56, 11, WHITE);
  circleOutline(x + 152, y + h - 56, 11, INK);
  fillRect(x + 150, y + h - 58, 4, 4, INK);
}
function picGoal(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, GREEN);
  fillRect(x + 24, y + 8, w - 48, h - 26, WHITE);
  for (let gx = x + 24; gx <= x + w - 24; gx += 12) line(gx, y + 8, gx, y + h - 18, GREY);
  for (let gy = y + 8; gy <= y + h - 18; gy += 10) line(x + 24, gy, x + w - 24, gy, GREY);
  rectOutline(x + 24, y + 8, w - 48, h - 26, INK);
  circle(x + Math.floor(w * 0.62), y + Math.floor(h * 0.66), 12, WHITE);
  circleOutline(x + Math.floor(w * 0.62), y + Math.floor(h * 0.66), 12, INK);
  fillRect(x + Math.floor(w * 0.62) - 2, y + Math.floor(h * 0.66) - 2, 4, 4, INK);
}
function picQuake(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, SKY);
  // mountains
  line(x + 4, y + h - 8, x + 60, y + 14, INK);
  line(x + 60, y + 14, x + 110, y + h - 8, INK);
  line(x + 70, y + h - 8, x + 130, y + 22, INK);
  line(x + 130, y + 22, x + w - 4, y + h - 8, INK);
  fillRect(x + 52, y + 22, 16, 8, WHITE);
  // seismograph strip
  fillRect(x + 8, y + h - 26, w - 16, 18, WHITE);
  rectOutline(x + 8, y + h - 26, w - 16, 18, INK);
  let px = x + 10, py = y + h - 17;
  const spikes = [0, 2, -3, 8, -9, 4, -2, 1, 0];
  for (let i = 0; i < spikes.length; i++) {
    const nx = px + 16, ny = py + spikes[i];
    line(px, py, nx, ny, RED); px = nx; py = ny;
  }
}
function picChalk(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, [34, 64, 48]);
  rectOutline(x + 4, y + 4, w - 8, h - 8, [180, 150, 100]);
  drawText(x + 12, y + 10, "E = MC2", 1, WHITE);
  drawText(x + 12, y + 24, "PI = 3.14", 1, WHITE);
  line(x + 12, y + 40, x + w - 20, y + 40, WHITE);
  drawText(x + 12, y + 46, "ZETA(S)=0", 1, GOLD);
  circle(x + w - 30, y + 18, 7, WHITE);
  line(x + w - 30, y + 11, x + w - 30, y + 25, INK);
  line(x + w - 37, y + 18, x + w - 23, y + 18, INK);
}
function picHospital(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, WHITE);
  fillRect(x + 14, y + 10, w - 28, h - 20, [210, 225, 235]);
  rectOutline(x + 14, y + 10, w - 28, h - 20, BLUE);
  const cx = x + Math.floor(w / 2), cy = y + Math.floor(h / 2);
  fillRect(cx - 16, cy - 5, 32, 10, RED);
  fillRect(cx - 5, cy - 16, 10, 32, RED);
  for (let i = 0; i < 3; i++) fillRect(x + 20 + i * 12, y + h - 14, 8, 4, BLUE);
}
function picDrone(x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, SKY);
  const cx = x + Math.floor(w / 2), cy = y + Math.floor(h / 2) + 4;
  fillRect(cx - 22, cy - 6, 44, 12, INK);
  circle(cx, cy, 5, RED);
  line(cx - 22, cy - 4, cx - 44, cy - 12, INK);
  line(cx + 22, cy - 4, cx + 44, cy - 12, INK);
  line(cx - 22, cy + 4, cx - 44, cy + 12, INK);
  line(cx + 22, cy + 4, cx + 44, cy + 12, INK);
  circleOutline(cx - 46, cy - 13, 8, INK);
  circleOutline(cx + 46, cy - 13, 8, INK);
  circleOutline(cx - 46, cy + 13, 8, INK);
  circleOutline(cx + 46, cy + 13, 8, INK);
  fillRect(cx - 3, cy + 6, 6, 10, BLUE);
}
const LEAD_PICS = [picFlags, picSkyline, picTanker];
const PICT_PICS = [picGlobe, picBadge, picChart, picStadium, picBoot, picGoal, picQuake, picChalk, picHospital, picDrone];

// ---------------------------------------------------------------- PNG
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(b: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}
function writePng(file: string): void {
  const raw = Buffer.alloc(H * (1 + W * 4));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 4)] = 0;
    Buffer.from(buf.buffer, y * W * 4, W * 4).copy(raw, y * (1 + W * 4) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = zlib.deflateSync(raw, { level: 9 });
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(file, png);
}

// ---------------------------------------------------------------- layout
fillRect(0, 0, W, H, PAPER);

// Masthead
fillRect(0, 0, W, 4, RED);
drawTextCentered(512, 10, "THE WORLD IN ONE DAY", 5, INK);
fillRect(16, 58, W - 32, 2, INK);
drawTextCentered(512, 64, "SUNDAY 22 NOVEMBER 2026", 2, RED);
const allStories = [...LEADS, ...PICTURED, ...BRIEFS];
const regions = new Set(allStories.map((s) => s.region));
const fields = new Set(allStories.map((s) => s.field));
const countsLine = `${allStories.length} STORIES - ${LEADS.length} LEADS - ${PICTURED.length} PICTURES - ${BRIEFS.length} BRIEFS - ${regions.size} REGIONS - ${fields.size} FIELDS - ALL TIMES UTC`;
drawTextCentered(512, 82, countsLine, 1, BLUE);

// Leads: 3 columns
const leadX = [16, 350, 684];
const leadW = 322;
LEADS.forEach((st, i) => {
  const x = leadX[i];
  let y = 96;
  rectOutline(x, y, leadW, 88, INK);
  LEAD_PICS[i](x + 1, y + 1, leadW - 2, 86);
  y += 94;
  y = drawWrapped(x, y, st.headline, 2, INK, leadW, 18);
  y += 2;
  y = drawWrapped(x, y, st.summary, 1, INK, leadW, 9);
  y += 2;
  drawText(x, y, st.region + " - " + st.field, 1, BLUE);
  // vertical divider between lead columns
  if (i < 2) fillRect(x + leadW + 6, 96, 1, 186, GREY);
});
fillRect(16, 292, W - 32, 2, INK);

// Picture grid: 2 rows x 5
const picW = 192, picGap = 8;
const picX0 = 16;
const rowY = [300, 410];
const rowH = 106;
PICTURED.forEach((st, i) => {
  const r = Math.floor(i / 5), c = i % 5;
  const x = picX0 + c * (picW + picGap);
  const y = rowY[r];
  rectOutline(x, y, picW, 52, INK);
  PICT_PICS[i](x + 1, y + 1, picW - 2, 50);
  let cy = y + 56;
  cy = drawWrapped(x, cy, st.headline, 1, INK, picW, 9);
  const sumLines = wrapLines(st.summary, 1, picW).slice(0, 2);
  sumLines.forEach((ln, k) => drawText(x, cy + k * 9, ln, 1, [70, 66, 58]));
  drawText(x, y + rowH - 10, st.region + " - " + st.field, 1, RED);
});
fillRect(16, 524, W - 32, 2, INK);

// Briefs: 3 columns x 11. Each column's inter-brief gap is sized from its own
// wrapped line count so all three columns fill the 532-858 band evenly
// (a fixed 4px gap left ~150px of dead paper under the briefs).
const briefX = [16, 350, 684];
const briefW = 322;
const briefTop = 532, briefBottom = 858;
for (let col = 0; col < 3; col++) {
  const items = BRIEFS.slice(col * 11, col * 11 + 11);
  const lineCounts = items.map((st) =>
    wrapLines(st.region + " - " + st.field + ": " + st.summary, 1, briefW).length);
  const textH = lineCounts.reduce((a, n) => a + n * 9, 0);
  const gap = Math.max(4, Math.floor((briefBottom - briefTop - textH) / 10));
  let y = briefTop;
  for (let r = 0; r < 11; r++) {
    y = drawBrief(briefX[col], y, items[r], briefW);
    y += gap;
    if (r < 10) fillRect(briefX[col], y - Math.floor(gap / 2), briefW, 1, LIGHT);
  }
}
fillRect(16, 858, W - 32, 2, INK);

// Timeline strip
drawTextCentered(512, 866, "THE DAY IN UTC - ALL TIMES UTC", 1, RED);
const tlX = [16, 266, 516, 766];
const tlW = 242;
TIMELINE.forEach((band, i) => {
  const x = tlX[i];
  drawText(x, 882, band.band, 1, BLUE);
  drawWrapped(x, 894, band.text, 1, INK, tlW, 9);
  if (i < 3) fillRect(x + tlW + 4, 882, 1, 62, GREY);
});
fillRect(16, 956, W - 32, 2, INK);

// Footer
drawTextCentered(512, 966, "ALL 46 STORIES FIRST REPORTED SUNDAY 22 NOV 2026 - DATES CHECKED AGAINST PUBLICATION", 1, INK);
drawTextCentered(512, 980, "SOURCES: WIRE AND PRESS REPORTS OF 22 NOV 2026", 1, GREY);
drawTextCentered(512, 996, "THE WORLD IN ONE DAY - PAGE 1", 1, GREY);

// ---------------------------------------------------------------- write
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "entry.png");
writePng(outFile);
const size = fs.statSync(outFile).size;
console.log(`stories=${allStories.length} leads=${LEADS.length} pictures=${PICTURED.length} briefs=${BRIEFS.length} regions=${regions.size} fields=${fields.size}`);
console.log(`regions: ${[...regions].sort().join(", ")}`);
console.log(`fields: ${[...fields].sort().join(", ")}`);
console.log(`timeline bands=4`);
console.log(`wrote ${outFile} ${size} bytes 1024x1024`);
