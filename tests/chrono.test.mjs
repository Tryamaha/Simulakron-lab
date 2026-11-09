import test from "node:test";
import assert from "node:assert/strict";
import {EXHIBITS,MIN_YEAR,MAX_YEAR,scaleYear,unscaleYear,elapsed,yearText,nearest} from "../chrono-data.js";
import {CO2_GLOBAL_ANNUAL,CO2_FIRST_YEAR,CO2_LAST_YEAR,co2ForYear} from "../co2-annual-data.js";

test("Time tunnel has 20 strictly chronological exhibits",()=>{
 assert.equal(EXHIBITS.length,20);
 assert.equal(EXHIBITS[0].year,MIN_YEAR);
 assert.equal(EXHIBITS.at(-1).year,MAX_YEAR);
 assert.ok(EXHIBITS.every((x,i)=>Number.isInteger(x.year)&&x.year!==0&&(i===0||x.year>EXHIBITS[i-1].year)));
});
test("Astronomical-to-historical chronology has no year zero",()=>{
 assert.equal(elapsed(-1,1),1);
 assert.equal(elapsed(-12000,3000),14999);
 assert.equal(unscaleYear(scaleYear(-1)),-1);
 assert.equal(unscaleYear(scaleYear(1)),1);
 assert.notEqual(unscaleYear(.8),0);
});
test("Time-axis position is physically proportional to calendar year",()=>{
 const total=elapsed(MIN_YEAR,MAX_YEAR);
 for(const e of EXHIBITS){
  const expected=elapsed(MIN_YEAR,e.year)/total;
  assert.ok(Math.abs(scaleYear(e.year)-expected)<1e-10);
 }
 assert.ok(scaleYear(1453)>scaleYear(1071));
});
test("Every curated exhibit identifies evidence, unknowns, and non-fiction future",()=>{
 const allowed=new Set(["evidence","inference","fiction"]);
 for(const e of EXHIBITS){
  assert.ok(allowed.has(e.type),e.title);
  assert.ok(e.evidence.length>15,e.title);
  assert.ok(e.unknown.length>15,e.title);
  assert.equal(e.type==="fiction",e.year>2026,e.title);
 }
});
test("No numeric invented historical probability or fictional source",()=>{
 for(const e of EXHIBITS){
  assert.equal(typeof e.precision,"string");
  for(const source of e.sources){assert.match(source.url,/^https:\/\//);assert.ok(source.label);}
 }
 const g=EXHIBITS.find(x=>x.label==="Göbeklitepe");
 assert.equal(g.year,-9600);
 assert.ok(g.sources.some(s=>s.url.includes("whc.unesco.org")));
});
test("Nearest waypoint selects a real exhibit",()=>{
 for(const e of EXHIBITS){assert.equal(nearest(scaleYear(e.year)),e);}
});
test("NOAA global CO2 dataset is complete 1979 through 2025",()=>{
 assert.equal(CO2_FIRST_YEAR,1979);
 assert.equal(CO2_LAST_YEAR,2025);
 assert.equal(CO2_GLOBAL_ANNUAL.length,47);
 assert.deepEqual(co2ForYear(1979),{year:1979,value:336.85,preliminary:false});
 assert.deepEqual(co2ForYear(2025),{year:2025,value:425.62,preliminary:true});
 assert.equal(co2ForYear(2024).value,422.79);
});
test("Never synthesize observed annual CO2 outside published range",()=>{
 for(const year of [-12000,-1,0,1750,1923,1969,1978,2026,2100,3000]){
  assert.equal(co2ForYear(year),null);
 }
});
test("Observed NOAA annual CO2 values are finite, physically plausible, and positive",()=>{
 assert.ok(CO2_GLOBAL_ANNUAL.every(x=>Number.isFinite(x)&&x>300&&x<500));
 assert.equal(yearText(-9600),"MÖ 9.600");
 assert.equal(yearText(2026),"2026");
});