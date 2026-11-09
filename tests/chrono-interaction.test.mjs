import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=(name)=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const html=source("chrono.html");
const ui=source("chrono.js");
const renderer=source("chrono-render.js");

test("year gates and the current-year button have a detail dialog",()=>{
 for(const id of [
  "cw-exhibit-modal","cw-modal-title","cw-modal-year","cw-modal-group","cw-modal-level",
  "cw-modal-description","cw-modal-evidence","cw-modal-unknown","cw-modal-sources",
  "cw-modal-precision","cw-modal-close","cw-modal-resume","cw-modal-next","cw-open-current"
 ])assert.ok(html.includes('id="'+id+'"'),"missing dialog element "+id);
 assert.match(html,/aria-modal="true"/);
 assert.match(html,/cw-exhibit-modal"[^>]*hidden/);
});
test("every year card opens the same dialog, with evidence and uncertainty",()=>{
 assert.match(ui,/function toExhibit\(item\)\{openExhibit\(item\);\}/);
 assert.match(ui,/b\.addEventListener\("click",\(\)=>toExhibit\(item\)\)/);
 for(const target of ["cw-modal-description","cw-modal-evidence","cw-modal-unknown","cw-modal-year"])
  assert.ok(ui.includes('$("'+target+'").textContent'),"modal data not connected: "+target);
 assert.match(ui,/openExhibit\(item\)/);
 assert.match(ui,/engine\?\.pause\(\);updatePlay\(\)/);
});
test("3D year portals respond to raycaster hits and ignore drag taps",()=>{
 assert.match(renderer,/pick\(clientX,clientY\)/);
 assert.match(renderer,/raycaster\.setFromCamera/);
 assert.match(renderer,/raycaster\.intersectObjects/);
 assert.match(renderer,/onSelect\(item\)/);
 assert.match(ui,/engine\?\.pick\(e\.clientX,e\.clientY\)/);
 assert.match(ui,/const tapped=!pressed\.moved/);
 assert.match(ui,/if\(!hit\)openExhibit\(nearest\(/);
});
test("year cards remain accessible even when WebGL is unsupported",()=>{
 assert.match(ui,/cw-open-current/);
 assert.ok(html.includes('role="dialog"'));
});
