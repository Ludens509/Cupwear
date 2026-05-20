import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(Flip, ScrollTrigger);

interface Refs {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  mesh: THREE.Object3D | null;
  ctx: gsap.Context | null;
  idleTween: gsap.core.Tween | null;
}

export default function FlipCube() {
  const initialRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const three = useRef<Refs>({
    renderer: null,
    scene: null,
    camera: null,
    mesh: null,
    ctx: null,
    idleTween: null,
  });

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

  function buildTimeline() {
    const { mesh, ctx: prevCtx } = three.current;
    prevCtx?.revert();

    const canvas = canvasRef.current;
    const second = secondRef.current?.querySelector<HTMLElement>(".marker");
    const third = thirdRef.current?.querySelector<HTMLElement>(".marker");

    if (!canvas || !second || !third) return;

    three.current.ctx = gsap.context(() => {
      const s2 = Flip.getState(second);
      const s3 = Flip.getState(third);

      const canvasState = Flip.getState(canvas);
      Flip.from(canvasState, { duration: 0, targets: canvas });

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

      tl.add(flip1 as gsap.core.Tween, 0);

      if (mesh) {
        tl.to(
          mesh.rotation,
          { x: `+=${Math.PI}`, y: `+=${Math.PI}`, duration: 1, ease: "none" },
          "0",
        );
      }

      tl.addLabel("mid", "+=0.5").add(flip2 as gsap.core.Tween, "mid");

      if (mesh) {
        tl.to(
          mesh.rotation,
          { x: `+=${Math.PI}`, y: `+=${Math.PI}`, duration: 1, ease: "none" },
          "mid",
        );
      }
    });
  }

  function initThree(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.5);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    three.current = { ...three.current, renderer, scene, camera };

    gsap.ticker.add(() => renderer.render(scene, camera));
    onResize();
    buildTimeline(); // start Flip animation immediately, no model needed

    const loader = new GLTFLoader();
    loader.load(
      "/soccer-ball.glb",
      (gltf) => {
        const model = gltf.scene;

        // Normalize size and center
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.8 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Pivot holds scroll rotation; model holds idle spin — no conflicts
        const pivot = new THREE.Group();
        pivot.add(model);
        scene.add(pivot);
        three.current.mesh = pivot;

        // Continuous self-rotation on the model's own Y axis
        three.current.idleTween = gsap.to(model.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: 5,
          repeat: -1,
          ease: "none",
        });

        buildTimeline(); // rebuild to wire in scroll rotation on pivot
      },
      undefined,
      (err) => console.error("Failed to load soccer-ball.glb:", err),
    );
  }

  function teardown() {
    three.current.ctx?.revert();
    three.current.idleTween?.kill();
    three.current.idleTween = null;

    if (three.current.renderer) {
      three.current.renderer.dispose();
      three.current.renderer = null;
    }

    if (canvasRef.current && initialRef.current?.contains(canvasRef.current)) {
      initialRef.current.removeChild(canvasRef.current);
    }
    canvasRef.current = null;
  }

  function build() {
    teardown();
    const container = initialRef.current;
    if (!container) return;

    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.className = "box";
      canvasRef.current = canvas;

      container
        .querySelectorAll("canvas.box")
        .forEach((old) => container.removeChild(old));

      container.appendChild(canvas);
      initThree(canvas);
    } else {
      buildTimeline();
    }
  }

  useEffect(() => {
    build();

    const handleResize = () => {
      onResize();
      buildTimeline();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      teardown();
      gsap.ticker.remove(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="spacer">scroll down</div>

      <div ref={stageRef} className="main">
        <div ref={initialRef} className="container initial" />

        <div ref={secondRef} className="container second">
          <div className="marker" />
        </div>

        <div ref={thirdRef} className="container third">
          <div className="marker" />
        </div>
      </div>

      <div className="spacer final">end</div>

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

        .initial {
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
          outline-offset: -6px;
          opacity: 0.6;
        }

        canvas.box {
          width: 200px;
          height: 200px;
          border: 1px dashed #ffffffe0;
          display: block;
          border-radius: 50%;
          background: transparent;
          z-index: 2;
        }
      `}</style>
    </>
  );
}
