import test from "node:test";
import assert from "node:assert/strict";
import {julianDate, gmst, horizontal, sunHorizontal, calendarYears, historicalToAstronomical, lightTravel, lorentzGamma, travellerYears} from "../science-core.js";
const near=(actual,expected,tolerance,msg)=>assert.ok(Math.abs(actual-expected)<=tolerance,(msg||"value")+": "+actual+" should be near "+expected+" ± "+tolerance);
test("Julian date at J2000.0",()=>near(julianDate(new Date("2000-01-01T12:00:00.000Z")),2451545,1e-8));
test("Greenwich sidereal time at J2000",()=>near(gmst(new Date("2000-01-01T12:00:00.000Z")),280.46061837,1e-5));
test("historical BCE has no year zero",()=>{
 assert.equal(historicalToAstronomical(-1),0);
 assert.equal(historicalToAstronomical(1),1);
 assert.equal(calendarYears(-1,1),1);
 assert.equal(calendarYears(-12000,2026),14025);
 assert.throws(()=>historicalToAstronomical(0),RangeError);
});
test("astronomical unit light-time",()=>near(lightTravel(1,"au").minutes,8.316746,0.001));
test("light year is one Julian year of travel",()=>near(lightTravel(1,"ly").years,1,1e-8));
test("Lorentz factor at v=0.8c",()=>{
 near(lorentzGamma(.8),5/3,1e-12);
 near(travellerYears(10,.8),6,1e-12);
 assert.equal(lorentzGamma(1),Infinity);
});
test("a star on the local zenith",()=>{
 const d=new Date("2026-11-09T12:00:00Z");
 const longitude=27.43,latitude=38.61,ra=(gmst(d)+longitude)%360;
 near(horizontal(ra,latitude,latitude,longitude,d).alt,90,1e-5);
});
test("Polaris altitude near observer latitude",()=>{
 const d=new Date("2026-11-09T12:00:00Z");
 near(horizontal(37.955,89.264,38.61,27.43,d).alt,38.61,1);
});
test("Sun near equatorial zenith around March equinox at local midday",()=>{
 const d=new Date("2026-03-20T12:00:00Z");
 assert.ok(sunHorizontal(0,0,d).alt>85);
});
