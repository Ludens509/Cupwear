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
function makeGradientNoiseTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;

  const grd = g.createLinearGradient(0, 0, 230, 384);
  grd.addColorStop(0, "#fec5fb");
  grd.addColorStop(1, "#00bae2");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);

  // Subtle grain
  for (let i = 0; i < 4000; i++) {
    const x = Math.floor(gsap.utils.random(0, 256));
    const y = Math.floor(gsap.utils.random(0, 256));
    const a = gsap.utils.random(0.02, 0.1);
    g.fillStyle = `rgba(0,0,0,${a})`;
    g.fillRect(x, y, 3, 3);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

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

    const mat = new THREE.MeshBasicMaterial({
      map: makeGradientNoiseTexture(),
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
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
        <div ref={initialRef} className="container initial"/>

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
          border-radius: 10px;
          background: transparent;
          z-index: 2;
        }
      `}</style>
    </>
  );
}
