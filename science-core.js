/* SIMULAKRON SCIENCE CORE v2
   Approximate scientific algorithms (not a precision observatory).
   USNO alt/az: https://aa.usno.navy.mil/faq/alt_az
   USNO sidereal: https://aa.usno.navy.mil/faq/GAST
   USNO solar: https://aa.usno.navy.mil/faq/sun_approx
   NASA light-year: https://science.nasa.gov/exoplanets/what-is-a-light-year/ */
export const C_KM_S=299792.458;
export const AU_KM=149597870.7;
export const LY_KM=9.4607304725808e12;
export const DEG=Math.PI/180;
export const mod360=x=>((x%360)+360)%360;
export const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
export const julianDate=date=>date.getTime()/86400000+2440587.5;
export function gmst(date){const d=julianDate(date)-2451545;return mod360(280.46061837+360.98564736629*d+0.000387933*(d/36525)**2);}
export function horizontal(ra,dec,lat,lon,date){
 const phi=lat*DEG,delta=dec*DEG,h=mod360(gmst(date)+lon-ra)*DEG;
 const alt=Math.asin(clamp(Math.sin(phi)*Math.sin(delta)+Math.cos(phi)*Math.cos(delta)*Math.cos(h),-1,1))/DEG;
 const az=mod360(Math.atan2(-Math.sin(h),Math.tan(delta)*Math.cos(phi)-Math.sin(phi)*Math.cos(h))/DEG);
 return {alt,az,visible:alt>0};
}
export function sunEquatorial(date){
 const d=julianDate(date)-2451545;
 const g=mod360(357.529+0.98560028*d)*DEG,q=mod360(280.459+0.98564736*d);
 const L=mod360(q+1.915*Math.sin(g)+.020*Math.sin(2*g))*DEG;
 const e=(23.439-.00000036*d)*DEG;
 return {ra:mod360(Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L))/DEG),dec:Math.asin(Math.sin(e)*Math.sin(L))/DEG};
}
export function sunHorizontal(lat,lon,date){const x=sunEquatorial(date);return horizontal(x.ra,x.dec,lat,lon,date);}
export const BRIGHT_STARS=[
 ["Sirius",101.287,-16.716,-1.46],["Canopus",95.988,-52.696,-.74],["Arcturus",213.915,19.182,-.05],
 ["Vega",279.235,38.784,.03],["Capella",79.172,45.998,.08],["Rigel",78.634,-8.202,.13],
 ["Procyon",114.825,5.225,.34],["Betelgeuse",88.793,7.407,.45],["Achernar",24.429,-57.236,.46],
 ["Altair",297.696,8.868,.77],["Aldebaran",68.980,16.509,.86],["Spica",201.298,-11.161,.98],
 ["Antares",247.351,-26.432,1.06],["Pollux",116.329,28.026,1.14],["Fomalhaut",344.413,-29.622,1.16],
 ["Deneb",310.358,45.280,1.25],["Regulus",152.093,11.967,1.35],["Castor",113.650,31.888,1.58],
 ["Polaris",37.955,89.264,1.98],["Dubhe",165.932,61.751,1.79],["Alkaid",206.885,49.313,1.86],
 ["Mirfak",51.081,49.861,1.79]
];
export function historicalToAstronomical(y){if(y===0)throw new RangeError("Tarihte yıl sıfır yoktur");return y<0?y+1:y;}
export const calendarYears=(from,to)=>historicalToAstronomical(to)-historicalToAstronomical(from);
export const yearLabel=y=>y<0?"MÖ "+Math.abs(y).toLocaleString("tr-TR"):String(y);
export const lorentzGamma=beta=>beta>=1?Infinity:1/Math.sqrt(1-beta*beta);
export const travellerYears=(earthYears,beta)=>earthYears/lorentzGamma(beta);
export function lightTravel(value,unit="km"){
 const km=value*(unit==="ly"?LY_KM:unit==="au"?AU_KM:1),seconds=km/C_KM_S;
 return {seconds,minutes:seconds/60,days:seconds/86400,years:seconds/(86400*365.25)};
}
