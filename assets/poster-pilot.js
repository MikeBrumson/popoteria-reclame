/* Poster animat La Popoteria — motorul comun, 3 acte într-o buclă de 12 s.
   PILOT etapa 4 (19.10.2026): v2 + efectele din 23ec04a (abur în actul C, preț după nume). v2 (19.10.2026): fără unealtă și fără ingrediente căzătoare; logoul stă deasupra textului, mereu vizibil.
   Fiecare preparat își pune datele în window.PREPARAT înainte de acest fișier.
   ?t=<ms> îngheață posterul la momentul dat (pentru probe). */
(function () {
  "use strict";
  const P = window.PREPARAT;
  const CICLU = 12; // secunde de cronologie internă
  const DURATA_REALA = 20; // secunde pe ecran: cronologia se întinde 12→20 s (momente și mișcări mai domoale)
  const DOUA_PARTI = true; // Mihai, 19.10: 10 s de sus (prezentarea) + 10 s lateral (ingredientele)
  const W = 1920, H = 1080;
  const IMG_W = 1920, IMG_H = 1080;

  // ——— utilitare ———
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lin = (t, a, b) => cl((t - a) / (b - a));
  const eOut = (x) => 1 - Math.pow(1 - x, 3);
  const eInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const mix = (a, b, k) => a + (b - a) * k;
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ——— titlu încadrat: cuvintele mici rămân legate de vecin, fontul se micșorează până încape ———
  const LEGA = /(^|[\s>])(de|la|cu|a|și|si|în|pe|din|un|o|al|ale)\s+(?=[^<\s])/gi;
  const leagaCuvinte = (s) => String(s).replace(/<br\s*\/?>/gi, " ").replace(LEGA, "$1$2\u00a0").replace(LEGA, "$1$2\u00a0")
    .replace(/(\d[\d,.]*)\s+(L|l|g|kg|ml|cl)(?![\wăâîșț])/g, "$1\u00a0$2");
  // fit: coloană fixă, max. N rânduri; coboară fontul din 4 în 4 px până la minim (fără cuvinte rupte)
  const incadreaza = (e, max, min, randuri) => {
    const lh = parseFloat(getComputedStyle(e).lineHeight) / parseFloat(getComputedStyle(e).fontSize);
    let f = max; e.style.fontSize = f + "px";
    while (f > min && (e.scrollWidth > e.clientWidth + 1 || e.offsetHeight > f * lh * randuri + 2)) {
      f -= 4; e.style.fontSize = f + "px";
    }
  };

  // ——— scena ———
  const scena = el("div", "scena");
  document.body.appendChild(scena);
  const potriveste = () => {
    const s = Math.min(innerWidth / W, innerHeight / H);
    scena.style.transform = `translate(${-W * s / 2}px, ${-H * s / 2}px) scale(${s})`;
  };
  addEventListener("resize", potriveste); potriveste();

  const logo = el("div", "logo", `<span class="logo-img" role="img" aria-label="La Popoteria"></span>`);
  const pretHtml = P.pret != null ? `<div class="pret"><span class="suma">${P.pret}</span><span class="lei">lei</span></div>` : "";

  // Actul A — de sus
  const A = el("div", "act");
  A.innerHTML = `<div class="a-text"><div class="sprinceana">${P.categorie}</div><h1 class="nume">${leagaCuvinte(P.nume)}</h1><div class="linie"></div>${pretHtml.replace('class="pret"', 'class="pret pret-a"')}</div>`;
  const farf = el("div", "farfurie");
  const fimg = el("img"); fimg.src = P.poza; fimg.alt = "";
  farf.appendChild(fimg); A.appendChild(farf);
  scena.appendChild(A);
  // farfuria „privită de sus”: întindem pe verticală ca elipsa din poză să devină cerc
  const D = 860, fc = P.farfurie, k = (D / 2) / fc.rx, sy = fc.rx / fc.ry;
  Object.assign(farf.style, { width: D + "px", height: D + "px", left: (1330 - D / 2) + "px", top: (540 - D / 2) + "px" });
  Object.assign(fimg.style, { width: IMG_W * k + "px", height: IMG_H * k * sy + "px", left: (D / 2 - fc.cx * k) + "px", top: (D / 2 - fc.cy * k * sy) + "px" });

  // Actul B — lateral, aproape, lista ingredientelor (doar text)
  const B = el("div", "act");
  const bc = el("div", "b-cadru");
  const bimg = el("img", "poza"); bimg.src = P.poza; bimg.alt = "";
  bc.appendChild(bimg); B.appendChild(bc);
  B.appendChild(el("div", "voal-b"));
  const bt = el("div", "b-text", `<div class="sprinceana">Ingrediente</div><ul class="ingr">${P.ingrediente.map((x, i) => `<li><span>0${i + 1}</span>${x}</li>`).join("")}</ul>`);
  B.appendChild(bt);
  const aburSvg = (w, h) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${[0, 1, 2].map((i) => `<path d="M${w * (0.3 + i * 0.2)} ${h} C${w * (0.3 + i * 0.2) - 40} ${h * 0.7} ${w * (0.3 + i * 0.2) + 40} ${h * 0.45} ${w * (0.3 + i * 0.2)} ${h * 0.2}"/>`).join("")}</svg>`;
  const aburB = el("div", "abur", P.abur ? aburSvg(360, 420) : "");
  B.appendChild(aburB);
  scena.appendChild(B);

  // Actul C — poza aproape + prețul
  const C = el("div", "act");
  const cc = el("div", "c-cadru");
  const cimg = el("img", "poza"); cimg.src = P.poza; cimg.alt = "";
  cc.appendChild(cimg); C.appendChild(cc);
  C.appendChild(el("div", "voal-c"));
  C.appendChild(el("div", "c-text", `<div class="sprinceana">${P.categorie}</div><div class="numemic">${leagaCuvinte(P.numeScurt)}</div>${pretHtml}`));
  const aburC = el("div", "abur", P.abur ? aburSvg(220, 300) : "");
  C.appendChild(aburC);
  scena.appendChild(C);
  scena.appendChild(logo); // deasupra tuturor actelor, mereu vizibil
  const CZ = 1.18; // zoom poza în actul C

  // ——— cronologia ———
  const vizibil = (t, s, e) => Math.min(lin(t, s - 0.25, s + 0.3), 1 - lin(t, e - 0.25, e + 0.3));

  // Două părți de câte 10 s (Mihai, 19.10): 0–10 s farfuria de sus, rotindu-se, cu prezentarea produsului;
  // 10–20 s vederea laterală, statică (crește foarte puțin), cu ingredientele. Actul C nu mai apare.
  function douaParti(ms) {
    const s = ms / 1000, la = s * CICLU / DURATA_REALA, trec = eInOut(lin(s, 9.6, 10.4));
    C.style.opacity = 0;
    A.style.opacity = 1 - trec;
    if (A.style.opacity > 0) {
      farf.style.transform = `scale(${mix(0.9, 1, eOut(lin(la, -0.3, 1.4)))}) rotate(${(la + 0.3) * 7}deg)`;
      const at = A.querySelector(".a-text"), [spr, nume, linie] = at.children, pa = at.querySelector(".pret-a");
      spr.style.opacity = eOut(lin(la, 0.05, 0.6)); spr.style.transform = `translateY(${(1 - eOut(lin(la, 0.05, 0.6))) * 20}px)`;
      nume.style.opacity = eOut(lin(la, 0.2, 0.95)); nume.style.transform = `translateY(${(1 - eOut(lin(la, 0.2, 1.1))) * 46}px)`;
      linie.style.transform = `scaleX(${eOut(lin(la, 0.6, 1.4))})`;
      if (pa) { pa.style.opacity = eOut(lin(la, 0.9, 1.6)); pa.style.transform = `translateY(${(1 - eOut(lin(la, 0.9, 1.7))) * 30}px)`; }
    }
    B.style.opacity = trec;
    if (B.style.opacity > 0) {
      const lb = s - 10, z = (P.zoomB || 1.62) * mix(1, 1.035, lin(lb, -0.4, 10)), fx = 1290, fy = 600;
      bimg.style.width = IMG_W + "px";
      bimg.style.transform = `translate(${fx - P.focus.x * z}px, ${fy - P.focus.y * z}px) scale(${z})`;
      bt.firstChild.style.opacity = eOut(lin(lb, 0, 0.6));
      bt.querySelectorAll("li").forEach((e, i) => {
        const p = eOut(lin(lb, 0.3 + i * 0.5, 1.1 + i * 0.5));
        e.style.opacity = p; e.style.transform = `translateX(${(1 - p) * -36}px)`;
      });
      if (P.abur) {
        aburB.style.left = (fx - 180) + "px"; aburB.style.top = (fy - 560) + "px";
        aburB.querySelectorAll("path").forEach((pa, i) => {
          const c = ((lb + i * 0.55) % 1.9) / 1.9;
          pa.style.transform = `translateY(${-c * 120}px) translateX(${Math.sin(c * 6 + i) * 14}px)`;
          pa.style.opacity = Math.sin(c * Math.PI) * 0.9;
        });
      }
    }
  }

  function randeaza(ms) {
    if (DOUA_PARTI) return douaParti(ms);
    const t = ((ms / 1000) * CICLU / DURATA_REALA) % CICLU;
    const tA = t >= CICLU - 0.3 ? t - CICLU : t;

    // Actul A (0–4 s)
    const la = tA;
    A.style.opacity = vizibil(tA, 0, 4);
    if (A.style.opacity > 0) {
      const sc = mix(0.9, 1, eOut(lin(la, -0.3, 1.4)));
      farf.style.transform = `scale(${sc}) rotate(${(la + 0.3) * 7}deg)`;
      const [spr, nume, linie] = A.querySelector(".a-text").children;
      spr.style.opacity = eOut(lin(la, 0.05, 0.6)); spr.style.transform = `translateY(${(1 - eOut(lin(la, 0.05, 0.6))) * 20}px)`;
      nume.style.opacity = eOut(lin(la, 0.2, 0.95)); nume.style.transform = `translateY(${(1 - eOut(lin(la, 0.2, 1.1))) * 46}px)`;
      linie.style.transform = `scaleX(${eOut(lin(la, 0.6, 1.4))})`;
      const pa = A.querySelector(".pret-a"); if (pa) { pa.style.opacity = eOut(lin(la, 0.9, 1.6)); pa.style.transform = `translateY(${(1 - eOut(lin(la, 0.9, 1.7))) * 30}px)`; }
    }

    // Actul B (4–8 s)
    const lb = t - 4;
    B.style.opacity = vizibil(t, 4, 8);
    if (B.style.opacity > 0) {
      const z = mix(1.62, 1.82, lin(lb, -0.3, 4.3));
      const fx = mix(1290, 1190, eInOut(lin(lb, -0.3, 4.3))), fy = mix(600, 570, lin(lb, -0.3, 4.3));
      bimg.style.width = IMG_W + "px";
      bimg.style.transform = `translate(${fx - P.focus.x * z}px, ${fy - P.focus.y * z}px) scale(${z})`;
      bt.querySelectorAll("li").forEach((li, i) => {
        const p = eOut(lin(lb, 0.25 + i * 0.4, 0.95 + i * 0.4));
        li.style.opacity = p; li.style.transform = `translateX(${(1 - p) * -36}px)`;
      });
      bt.firstChild.style.opacity = eOut(lin(lb, 0, 0.5));
      if (P.abur) {
        aburB.style.left = (fx - 180) + "px"; aburB.style.top = (fy - 560) + "px";
        aburB.querySelectorAll("path").forEach((pa, i) => {
          const c = ((lb + i * 0.55) % 1.9) / 1.9;
          pa.style.transform = `translateY(${-c * 120}px) translateX(${Math.sin(c * 6 + i) * 14}px)`;
          pa.style.opacity = Math.sin(c * Math.PI) * 0.9;
        });
      }
    }

    // Actul C (8–12 s): zoom lent pe poză, apoi numele și prețul
    const lc = t - 8;
    C.style.opacity = vizibil(t, 8, CICLU);
    if (C.style.opacity > 0) {
      const z = mix(CZ, CZ + 0.1, lin(lc, -0.3, 4.3));
      const ox = 1330 - P.focus.x * z, oy = 600 - P.focus.y * z;
      cimg.style.transform = `translate(${ox}px, ${oy}px) scale(${z})`;
      cimg.style.width = IMG_W + "px";
      if (P.abur) {
        const tx = ox + P.muscatura.x * z, ty = oy + P.muscatura.y * z;
        aburC.style.left = (tx - 110) + "px"; aburC.style.top = (ty - 330) + "px";
        aburC.style.opacity = lin(lc, 0.5, 1.4);
        aburC.querySelectorAll("path").forEach((pa, i) => {
          const c = ((lc + i * 0.5) % 1.6) / 1.6;
          pa.style.transform = `translateY(${-c * 90}px) translateX(${Math.sin(c * 6 + i) * 10}px)`;
          pa.style.opacity = Math.sin(c * Math.PI) * 0.85;
        });
      }
      const [spr, nm, pr] = C.querySelector(".c-text").children;
      spr.style.opacity = eOut(lin(lc, 0, 0.5));
      nm.style.opacity = eOut(lin(lc, 0.15, 0.7)); nm.style.transform = `translateY(${(1 - eOut(lin(lc, 0.15, 0.8))) * 24}px)`;
      if (pr) { const q = eOut(lin(lc, 1.6, 2.4)); pr.style.opacity = q; pr.style.transform = `translateY(${(1 - q) * 40}px)`; }
    }
  }

  const incadreazaTot = () => {
    // titlul puțin mai mic (Mihai, 19.10) și prețul mereu în cadru: coborâm fontul până când blocul se termină deasupra marginii de jos
    const nm = A.querySelector(".nume"), at = A.querySelector(".a-text");
    incadreaza(nm, 160, 72, 3);
    let f = parseFloat(nm.style.fontSize);
    while (f > 72 && at.offsetTop + at.offsetHeight > H - 60) { f -= 4; nm.style.fontSize = f + "px"; }
    incadreaza(C.querySelector(".numemic"), 84, 44, 3);
  };

  // t mic (sub 100 s) = cadru înghețat pentru capturi; t mare (Date.now() pus de TV 1 ca să ocolească cache-ul) = animație normală
  const tq = new URLSearchParams(location.search).get("t"); const fix = tq != null && +tq < 100000 ? tq : null;
  const pornire = () => {
    if (fix != null) { randeaza(+fix); document.body.dataset.gata = "1"; return; }
    let t0 = performance.now();
    const bucla = (now) => { randeaza(now - t0); requestAnimationFrame(bucla); };
    // în rotație (index.html) posterul stă pe 0 până primește „porneste”, ca să înceapă cu actul A
    if (new URLSearchParams(location.search).has("asteapta")) {
      randeaza(0);
      addEventListener("message", (e) => { if (e.data === "porneste") { t0 = performance.now(); requestAnimationFrame(bucla); } }, { once: true });
      return;
    }
    requestAnimationFrame(bucla);
  };
  // pornim după ce poza e decodată, ca să nu apară nimic pe jumătate
  const img = new Image(); img.src = P.poza;
  const fonturi = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([img.decode ? img.decode().catch(() => {}) : 0, fonturi]).then(() => { incadreazaTot(); pornire(); }, pornire);
})();
