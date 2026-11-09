/** NOAA GML global marine surface annual mean CO2, ppm dry air, v2026-10.
 * Producer: Lan, X., Tans, P. and K.W. Thoning.
 * https://gml.noaa.gov/ccgg/trends/gl_data.html
 * https://doi.org/10.15138/9N0H-ZH07
 * 2025 is preliminary; there are no values before 1979 or after 2025.
 */
export const CO2_FIRST_YEAR=1979;
export const CO2_LAST_YEAR=2025;
export const CO2_GLOBAL_ANNUAL=Object.freeze([336.85,338.91,340.11,340.85,342.53,344.07,345.54,346.97,348.68,351.16,352.79,354.06,355.4,356.09,356.84,358.33,360.18,361.93,363.04,365.7,367.79,368.96,370.57,372.58,375.14,376.95,378.98,381.15,382.9,385.02,386.5,388.75,390.62,392.65,395.4,397.34,399.65,403.07,405.22,407.61,410.07,412.45,414.7,417.08,419.35,422.79,425.62]);
export function co2ForYear(year){
 if(!Number.isInteger(year)||year<CO2_FIRST_YEAR||year>CO2_LAST_YEAR)return null;
 return {year,value:CO2_GLOBAL_ANNUAL[year-CO2_FIRST_YEAR],preliminary:year===CO2_LAST_YEAR};
}
