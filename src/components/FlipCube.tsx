import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(Flip, ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Refs {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  mesh: THREE.Mesh | null;
  ctx: gsap.Context | null;
}

// ─── Helpers (pure functions, no React deps) ──────────────────────────────────

/** Builds the gradient + grain canvas texture */
// function makeGradientNoiseTexture(): THREE.CanvasTexture {
//   const c = document.createElement("canvas");
//   c.width = c.height = 256;
//   const g = c.getContext("2d")!;

//   const grd = g.createLinearGradient(0, 0, 230, 384);
//   grd.addColorStop(0, "#fec5fb");
//   grd.addColorStop(1, "#00bae2");
//   g.fillStyle = grd;
//   g.fillRect(0, 0, 256, 256);

//   // Subtle grain
//   for (let i = 0; i < 4000; i++) {
//     const x = Math.floor(gsap.utils.random(0, 256));
//     const y = Math.floor(gsap.utils.random(0, 256));
//     const a = gsap.utils.random(0.02, 0.1);
//     g.fillStyle = `rgba(0,0,0,${a})`;
//     g.fillRect(x, y, 3, 3);
//   }

//   const tex = new THREE.CanvasTexture(c);
//   tex.colorSpace = THREE.SRGBColorSpace;
//   tex.anisotropy = 4;
//   return tex;
// }
// ─────────────────────────────────────────────────────────────────────────────
// Classic black-and-white soccer ball texture (truncated icosahedron)
//
// A real soccer ball is a truncated icosahedron:
//   • 12 black regular pentagons  (from the 12 vertices)
//   • 20 white regular hexagons   (from the 20 face centers)
//
// We render this onto a 1024×1024 equirectangular canvas:
//   1. Off-white leather base with radial gradient shading
//   2. Pentagon centers placed at icosahedron vertex projections
//   3. White hexagon fills between pentagons
//   4. Black pentagon patches with inner sheen
//   5. Dashed stitch seam lines
//   6. Pebbled leather grain (6000 micro-dots)
//   7. Edge vignette for spherical depth
//   8. Specular gloss highlight (key light top-left)
//   9. Soft bounce light (bottom-right)
// ─────────────────────────────────────────────────────────────────────────────
function makeClassicBallTexture(): THREE.CanvasTexture {
  const SIZE = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const g = c.getContext("2d")!;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R  = SIZE * 0.47;
 
  // ── 1. Off-white leather base ─────────────────────────────────────────────
  const baseGrad = g.createRadialGradient(cx, cy, 0, cx, cy, R);
  baseGrad.addColorStop(0,   "#F8F8F6");
  baseGrad.addColorStop(0.7, "#F0F0EC");
  baseGrad.addColorStop(1,   "#E2E2DA");
  g.fillStyle = baseGrad;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.fill();
 
  // ── 2. Pentagon center positions ──────────────────────────────────────────
  // Icosahedron vertices projected to equirectangular (lon/lat → x/y).
  // Top pole, 5 upper, 5 lower (offset 36°), bottom pole = 12 total.
  function project(lat: number, lon: number): [number, number] {
    const x = cx + (lon / Math.PI) * R;
    const y = cy - (lat / (Math.PI / 2)) * R;
    return [x, y];
  }
 
  const p = Math.PI;
  const pentagons: [number, number][] = [
    project( p * 0.49,  0),                                       // top
    project( p * 0.17,  0),
    project( p * 0.17,  (2*p)/5),
    project( p * 0.17,  (4*p)/5),
    project( p * 0.17,  (6*p)/5),
    project( p * 0.17,  (8*p)/5),
    project(-p * 0.17,  p/5),
    project(-p * 0.17,  p/5 + (2*p)/5),
    project(-p * 0.17,  p/5 + (4*p)/5),
    project(-p * 0.17,  p/5 + (6*p)/5),
    project(-p * 0.17,  p/5 + (8*p)/5),
    project(-p * 0.49,  0),                                       // bottom
  ];
 
  const PENT_R = R * 0.112;
  const HEX_R  = R * 0.108;
 
  // ── 3. White hexagon fills ────────────────────────────────────────────────
  function mid(a: [number,number], b: [number,number]): [number,number] {
    return [(a[0]+b[0])/2, (a[1]+b[1])/2];
  }
 
  function hexAt(pos: [number,number], rot = 0) {
    drawPoly(g, pos[0], pos[1], 6, HEX_R, rot);
    g.fillStyle = "#FAFAF8";
    g.fill();
    // Subtle inner shadow ring
    g.strokeStyle = "rgba(0,0,0,0.08)";
    g.lineWidth = 1.5;
    g.stroke();
  }
 
  // Top ring: between top pole and each upper pentagon
  for (let i = 1; i <= 5; i++) hexAt(mid(pentagons[0], pentagons[i]), Math.PI/6);
  // Middle band: upper-to-upper + upper-to-lower
  for (let i = 0; i < 5; i++) {
    hexAt(mid(pentagons[1+i], pentagons[1+((i+1)%5)]), 0);
    hexAt(mid(pentagons[1+i], pentagons[6+i]), Math.PI/6);
  }
  // Bottom ring: between bottom pole and each lower pentagon
  for (let i = 6; i <= 10; i++) hexAt(mid(pentagons[11], pentagons[i]), Math.PI/6);
 
  // ── 4. Black pentagon patches ─────────────────────────────────────────────
  pentagons.forEach(([px, py]) => {
    if (Math.hypot(px - cx, py - cy) > R * 1.05) return; // skip OOB
 
    // Dark gradient fill — charcoal, not pure black (more leather-like)
    const panelGrad = g.createRadialGradient(
      px - PENT_R * 0.3, py - PENT_R * 0.3, 0,
      px, py, PENT_R * 1.15
    );
    panelGrad.addColorStop(0, "#282828");
    panelGrad.addColorStop(1, "#0F0F0F");
    g.fillStyle = panelGrad;
    drawPoly(g, px, py, 5, PENT_R, Math.PI/5);
    g.fill();
 
    // Stitch border just inside pentagon edge
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.lineWidth = 1.8;
    drawPoly(g, px, py, 5, PENT_R * 0.82, Math.PI/5);
    g.stroke();
 
    // Leather sheen highlight on dark panel
    const sheen = g.createRadialGradient(
      px - PENT_R*0.3, py - PENT_R*0.3, 0,
      px, py, PENT_R
    );
    sheen.addColorStop(0, "rgba(255,255,255,0.10)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sheen;
    drawPoly(g, px, py, 5, PENT_R, Math.PI/5);
    g.fill();
  });
 
  // ── 5. Dashed stitch seam lines ───────────────────────────────────────────
  g.strokeStyle = "rgba(60,60,60,0.45)";
  g.lineWidth = 2;
  g.lineCap = "round";
  g.setLineDash([2, 6]);
 
  function seam(a: [number,number], b: [number,number]) {
    const dx = b[0]-a[0], dy = b[1]-a[1];
    if (Math.hypot(dx, dy) > R * 0.82) return;
    const d = Math.hypot(dx, dy);
    const nx = dx/d, ny = dy/d;
    const gap = PENT_R * 1.08;
    g.beginPath();
    g.moveTo(a[0]+nx*gap, a[1]+ny*gap);
    g.lineTo(b[0]-nx*gap, b[1]-ny*gap);
    g.stroke();
  }
 
  for (let i = 1; i <= 5; i++) seam(pentagons[0], pentagons[i]);
  for (let i = 0; i < 5; i++) {
    seam(pentagons[1+i], pentagons[1+((i+1)%5)]);
    seam(pentagons[1+i], pentagons[6+i]);
    seam(pentagons[6+i], pentagons[6+((i+1)%5)]);
    seam(pentagons[6+i], pentagons[11]);
  }
  g.setLineDash([]);
 
  // ── 6. Pebbled leather grain ──────────────────────────────────────────────
  for (let i = 0; i < 7000; i++) {
    const gx = (Math.random()-0.5)*SIZE*0.95 + cx;
    const gy = (Math.random()-0.5)*SIZE*0.95 + cy;
    if (Math.hypot(gx-cx, gy-cy) > R*0.96) continue;
    g.fillStyle = `rgba(0,0,0,${Math.random()*0.05})`;
    g.beginPath();
    g.arc(gx, gy, Math.random()*1.2+0.2, 0, Math.PI*2);
    g.fill();
  }
 
  // ── 7. Clip to circle + edge vignette ────────────────────────────────────
  g.save();
  g.globalCompositeOperation = "destination-in";
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI*2);
  g.fill();
  g.restore();
 
  const vignette = g.createRadialGradient(cx, cy, R*0.52, cx, cy, R);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.46)");
  g.fillStyle = vignette;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI*2);
  g.fill();
 
  // ── 8. Specular gloss — key light top-left ────────────────────────────────
  const gloss = g.createRadialGradient(
    cx - R*0.26, cy - R*0.26, 0,
    cx - R*0.26, cy - R*0.26, R*0.52
  );
  gloss.addColorStop(0,   "rgba(255,255,255,0.78)");
  gloss.addColorStop(0.35,"rgba(255,255,255,0.22)");
  gloss.addColorStop(1,   "rgba(255,255,255,0)");
  g.fillStyle = gloss;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI*2);
  g.fill();
 
  // ── 9. Soft bounce light bottom-right ─────────────────────────────────────
  const bounce = g.createRadialGradient(
    cx+R*0.42, cy+R*0.42, 0,
    cx+R*0.42, cy+R*0.42, R*0.52
  );
  bounce.addColorStop(0, "rgba(210,225,255,0.16)");
  bounce.addColorStop(1, "rgba(210,225,255,0)");
  g.fillStyle = bounce;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI*2);
  g.fill();
 
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
 
// ── Shared polygon helper ─────────────────────────────────────────────────────
function drawPoly(
  g: CanvasRenderingContext2D,
  x: number, y: number,
  sides: number, radius: number,
  rotation = 0
) {
  g.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = (i * 2 * Math.PI) / sides + rotation;
    const px = x + radius * Math.cos(a);
    const py = y + radius * Math.sin(a);
    if(i === 0) {
      g.moveTo(px, py);
    } else {
      g.lineTo(px, py);
    }
  }
  g.closePath();
}

// function drawRegularPolygon(
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number,
//   sides: number,
//   radius: number,
// ) {
//   ctx.beginPath();
//   for (let i = 0; i < sides; i++) {
//     const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
//     const px = x + radius * Math.cos(angle);
//     const py = y + radius * Math.sin(angle);
//     if (i === 0) {
//       ctx.moveTo(px, py);
//     } else {
//       ctx.lineTo(px, py);
//     }
//   }
//   ctx.closePath();
//   ctx.fill();
// }

// ─── Component ────────────────────────────────────────────────────────────────
export default function FlipCube() {
  // DOM refs for the three target containers
  const initialRef = useRef<HTMLDivElement>(null); // box 1 container (normal flow)

  const stageRef = useRef<HTMLDivElement>(null); // scroll stage (position:relative)

  const secondRef = useRef<HTMLDivElement>(null); // waypoint 2
  const thirdRef = useRef<HTMLDivElement>(null); // waypoint 3
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Three.js / GSAP state kept in a ref so it never triggers re-renders
  const three = useRef<Refs>({
    renderer: null,
    scene: null,
    camera: null,
    mesh: null,
    ctx: null,
    // ticker: null,
  });

  // ── onResize ──────────────────────────────────────────────────────────────
  function onResize() {
    const { renderer, camera } = three.current;
    const canvas = canvasRef.current;
    if (!renderer || !canvas) return;

    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    renderer.setPixelRatio(1);
    renderer.setSize(
      Math.max(1, r.width * dpr),
      Math.max(1, r.height * dpr),
      false,
    );

    if (camera) {
      camera.aspect = (r.width || 1) / (r.height || 1);
      camera.updateProjectionMatrix();
    }
  }

  // ── buildTimeline ─────────────────────────────────────────────────────────
  function buildTimeline() {
    const { mesh, ctx: prevCtx } = three.current;
    prevCtx?.revert();

    const canvas = canvasRef.current;
    const second = secondRef.current?.querySelector<HTMLElement>(".marker");
    const third = thirdRef.current?.querySelector<HTMLElement>(".marker");

    if (!canvas || !second || !third || !mesh) return;

    three.current.ctx = gsap.context(() => {
      // Capture states BEFORE any Flip manipulation
      const s2 = Flip.getState(second);
      const s3 = Flip.getState(third);

      // 1. Record canvas position BEFORE moving it
      const canvasState = Flip.getState(canvas);
      console.log("canvasState", canvasState);

      // 2. Move canvas to <body> so it escapes nested positioning context
      // document.body.appendChild(canvas);
      // canvas.style.display = 'none'; // prevent flicker during initial load
      // canvas.style.margin   = '0';

      // 3. Animate canvas from its old position (inside .initial) to new
      //    body-level position — this is instant/invisible on first load
      Flip.from(canvasState, { duration: 0, targets: canvas });

      // 5. Build the scrubbed scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      const flip1 = Flip.fit(canvas, s2, { duration: 1, ease: "none" });
      const flip2 = Flip.fit(canvas, s3, { duration: 1, ease: "none" });

      tl

        // ① Hop to second marker + rotate
        .add(flip1 as gsap.core.Tween, 0)
        .to(
          mesh.rotation,
          { x: `+=${Math.PI}`, y: `+=${Math.PI}`, duration: 1, ease: "none" },
          "0",
        )
        // ② Breathing room
        .addLabel("mid", "+=0.5")
        // ③ Hop to third marker + rotate again
        .add(flip2 as gsap.core.Tween, "mid")
        .to(
          mesh.rotation,
          { x: `+=${Math.PI}`, y: `+=${Math.PI}`, duration: 1, ease: "none" },
          "mid",
        );
    });
  }

  // ── initThree ─────────────────────────────────────────────────────────────
  function initThree(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    //material with canvas texture
    // const mat = new THREE.MeshBasicMaterial({
    //   map: makeSoccerBallTexture(),
    // });
    const mat = new THREE.MeshPhongMaterial({
      map: makeClassicBallTexture(), //makeSoccerBallTexture()
      shininess: 100,
      wireframe: false,
    });

    // Add after creating the scene
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

// Create a more complex geometry to better show rotation
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 4), mat); //BoxGeometry(1, 1, 1)
    scene.add(mesh);

    three.current = { ...three.current, renderer, scene, camera, mesh };

    // Render on GSAP ticker so ScrollTrigger timing stays in sync
    gsap.ticker.add(() => renderer.render(scene, camera));

    onResize();
    buildTimeline();
  }

  // ── teardown ──────────────────────────────────────────────────────────────
  function teardown() {
    three.current.ctx?.revert();

    if (three.current.renderer) {
      three.current.renderer.dispose();
      three.current.renderer = null;
    }

    // Remove injected canvas from DOM
    if (canvasRef.current && initialRef.current?.contains(canvasRef.current)) {
      initialRef.current.removeChild(canvasRef.current);
    }
    canvasRef.current = null;
  }

  // ── build ─────────────────────────────────────────────────────────────────
  function build() {
    teardown();
    const container = initialRef.current;
    // console.log("container:", container);
    if (!container) return;

    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.className = "box";
      canvasRef.current = canvas;

      // Remove any existing canvas elements to keep only the most recent one
      // It checks for any existing canvas elements with class box in the container
      const existingCanvases = container.querySelectorAll("canvas.box");
      if (existingCanvases.length > 0) {
        existingCanvases.forEach((oldCanvas) => {
          container.removeChild(oldCanvas); //Removes all old duplicates if found
        });
      }

      container.appendChild(canvas);
      initThree(canvas);
      // console.log("canvas:", canvas.parentNode);
    } else {
      buildTimeline();
    }
  }

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    build();

    const handleResize = () => {
      onResize();
      buildTimeline();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Full teardown on unmount
      window.removeEventListener("resize", handleResize);
      teardown();
      gsap.ticker.remove(() => {}); // ticker callbacks removed via ctx.revert()
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Scroll hint ── */}
      <div className="spacer">scroll down</div>

      {/* ── Main scroll stage ── */}
      <div ref={stageRef} className="main">
        {/* Starting container — canvas is injected here by initThree */}
        <div ref={initialRef} className="container initial" />

        {/* Second target */}
        <div ref={secondRef} className="container second">
          <div className="marker" />
        </div>

        {/* Third target */}
        <div ref={thirdRef} className="container third">
          <div className="marker" />
        </div>
      </div>

      {/* ── End spacer ── */}
      <div className="spacer final">end</div>

      {/* ── Scoped styles ── */}
      <style>{`
        .spacer {
          width: 100%;
          height: 20vh;
          display: grid;
          place-items: center;
          font-weight: 600;
          letter-spacing: 0.02em;
          opacity: 0.8;
        }

        .main {
          position: relative;
          height: 200vh;
        }

        .container {
          position: absolute;
          width: 200px;
          height: 200px;
          display: grid;
          place-items: center;
          border: 2px dashed rgba(210, 206, 255, 0.35);
          border-radius: 12px;
        }

        .initial  {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          
        }

        .container.second {
          left: 10%;
          top: 50%;
          width: 100px;
          height: 100px;
        }

        .second .marker {
          width: 100px;
          height: 100px;
        }

        .third {
          right: 10%;
          bottom: 3rem;
        }

        .marker {
          width: 200px;
          height: 200px;
          border-radius: 10px;
          // outline: 1px dashed rgba(210, 206, 255, 0.4);
          outline-offset: -6px;
          opacity: 0.6;
        }

        /* The canvas GSAP moves around */
        canvas.box {
          width: 200px;
          height: 200px;
          border: 1px dashed #ffffffe0;
          display: block;
          border-radius: 50%; /* Make container circular */
          background: transparent;
          z-index: 2;
        }
      `}</style>
    </>
  );
}
