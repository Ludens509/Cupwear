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
    buildTimeline();

    const loader = new GLTFLoader();
    loader.load(
      "/soccer-ball.glb",
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.8 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        const pivot = new THREE.Group();
        pivot.add(model);
        scene.add(pivot);
        three.current.mesh = pivot;

        three.current.idleTween = gsap.to(model.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: 5,
          repeat: -1,
          ease: "none",
        });

        buildTimeline();
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
        {/*
          Waypoint 1 — Kicker
          PNG requirement: kicking foot at BOTTOM-CENTER of the image.
          bottom:50% pins the image's bottom edge to the container center
          (exactly where the 3D ball sits). Body extends upward.
          Place file at: public/players/kicker.png
        */}
        <div ref={initialRef} className="container initial">
          <img
            src="/players/kicker.png"
            alt=""
            aria-hidden="true"
            className="player player-kicker"
          />
        </div>

        <div className="absolute grid grid-rows-2  rounded h-[30%] w-full top-[20%] z-10 mt-[100px] p-10  bg-transparent">
          <div className="flex flex-row border-b border-gray-300  w-full  items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
              alt=""
              aria-hidden="true"
              className="w-fit h-24 rounded-md object-cover mr-4  block"
            />
            <div className="w-1/2 h-24 text-2xl text rounded-md mr-4 text-medium p-1">
              <p className="line-4 dark:text-slate-600 font-medium">
                <span className="font-semibold text-neutral-900">
                  We're the go-to destination for World Cup 2026 kits.
                </span>{" "}
                Every nation, every colour, every crest — curated for fans who
                wear their passion, not just watch it.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3  w-full items-center justify-center text-lg p-1">
            <div className="flex flex-col justify-between p-2 gap-10">
              <span className="inline-block w-fit border font-bold border-[#bbbbb6] rounded-full py-[6px] px-4 text-base font-['DM_Sans'] text-[#4 tracking-[0.3px]">
                About Cupwear
              </span>

              {/* body: DM Sans, text-[14px], leading-[1.65], text-[#555] */}
              <p className="font-['DM_Sans'] text-lg leading-6 text-[#555] mt-2 px-6 tracking-tight ">
                We're the go-to destination for World Cup 2026 kits. Every
                nation, every colour, every crest — curated for fans who wear
                their passion, not just watch it.
              </p>

              <button className="bg-[#1B8A3E] text-white rounded-[999px] py-3 px-6  text-base font-medium hover:bg-[#16692f] transition-colors hover:scale-1.02 tracking-[0.02em] cursor-pointer w-fit">
                Get in touch
              </button>
            </div>
            <div className="flex justify-end items-end">
              <video
            src="/players/video.mp4"
            autoPlay
            loop
            muted
            aria-hidden="true"
            className=" w-full h-100 rounded-md object-cover"
          />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <p className="line-clamp-3">ur mission is to connect every fan with their nation's kit — before
            the first whistle, after the final goal.</p>
              <img src="/players/NEYMAR-JR.webp" 
              alt="Neymar" 
              aria-hidden="true" 
              className="w-[200px] h-[250px] rounded-md object-cover block mt-4" 
              />
            </div>
          </div>
        </div>

        {/*
          Waypoint 2 — Goalkeeper dive
          PNG requirement: hands at LEFT EDGE, body extending right.
          left:50% pins the image's left edge to the container center.
          Container + marker here are 100x100.
          Place file at: public/players/goalkeeper.png
        */}
        <div ref={secondRef} className="container second">
          <div className="marker" />
          
          {/* <img
            src="/players/goalkeeper.png"
            alt=""
            aria-hidden="true"
            className="player player-goalkeeper"
          /> */}
        </div>

        {/*
          Waypoint 3 — Power header
          PNG requirement: head at TOP-CENTER of the image, body below.
          top:50% pins the image's top edge to the container center.
          Place file at: public/players/header.png
        */}
        <div ref={thirdRef} className="container third">
          <div className="marker" />

          <img
            src="/players/midair.png"
            alt=""
            aria-hidden="true"
            className="player player-header"
          />
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
          width: -webkit-fill-available;
          // width: 200px;
          height: 200px;
          display: grid;
          place-items: center;
          overflow: visible;
        }

        .initial {
          left: 50%;
          top: 10%;
          transform: translateX(-50%);
        }

        .container.second {
          left: 50%;
          top: 60%;
          width: 350px;
          height: 100px;
        }

        .second .marker { width: 100px; height: 100px; }

        .third { right: 0%; bottom: 1rem; }

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
          display: block;
          border-radius: 50%;
          background: transparent;
          position: relative;
          z-index: 2;
        }

        /*
          mix-blend-mode: multiply removes the image's white/light background
          so players sit directly on the cream #f0f0ee page — no hard edges.
          Works with transparent PNG or studio shots on a plain white bg.
          The filter stack gives an editorial desaturated sports-mag look.
        */
        .player {
          position: absolute;
          pointer-events: none;
          object-fit: contain;
          mix-blend-mode: multiply;
          filter:
            saturate(0.78)
            contrast(1.15)
            brightness(0.92)
            drop-shadow(0 32px 64px rgba(17,17,17,0.38))
            drop-shadow(0 6px 16px rgba(17,17,17,0.2));
          z-index: 1;
        }
        .video-player {
          position: absolute;
          pointer-events: none;
          object-fit: contain;
          mix-blend-mode: multiply;
          filter:
            saturate(0.78)
            contrast(1.15)
            brightness(0.92)
            drop-shadow(0 32px 64px rgba(17,17,17,0.38))
            drop-shadow(0 6px 16px rgba(17,17,17,0.2));
          z-index: 1;
        }

        /*
          KICKER
          Foot is at the bottom-center of the image.
          bottom:50% → image bottom edge = container center = ball position.
          Mask fades the top so the player dissolves into the background.
        */
        /*
          KICKER — ball is 200px.
          height drives the scale: clamp(480px, 72vh, 1400px).
          bottom:50% pins the image's bottom edge to the container center
          so the foot (at the very bottom of the PNG) sits on the ball.
          Mask fades toward the top so the player dissolves naturally.
        */
        .player-kicker {
          height: clamp(480px, 72vh, 1400px);
          
          width: 1500px;
          bottom: 14%;
          left: 68.5%;
          transform: translateX(-50%);
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 10%,
            black 42%,
            rgba(0,0,0,0.4) 70%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            black 10%,
            black 42%,
            rgba(0,0,0,0.4) 70%,
            transparent 100%
          );
        }

        /*
          GOALKEEPER — ball is 100px (smaller marker at waypoint 2).
          Horizontal dive: width is the controlling dimension.
          clamp(300px, 52vw, 700px) keeps it proportional across screens.
          left:50% pins the image's left edge (hands) to the ball center.
          Mask fades the trailing right side.
        */
        .player-goalkeeper {
          // width: clamp(300px, 52vw, 700px);
          width: 2500px;
          height: auto;
          left: 50%;
          top: 40%;
          transform: translateY(-50%);
          -webkit-mask-image: linear-gradient(
            to left,
            transparent 0%,
            rgba(0,0,0,0.35) 18%,
            black 42%
          );
          mask-image: linear-gradient(
            to left,
            transparent 0%,
            rgba(0,0,0,0.35) 18%,
            black 42%
          );
        }

        /*
          HEADER — ball is 200px.
          Same clamp logic as kicker.
          top:50% pins the image's top edge (head) to the ball center
          so the forehead (at the very top of the PNG) meets the ball.
          Mask fades legs into the background.
        */
        .player-header {
          background: transparent;
          background-size: cover;
          background-position: center;
          height: clamp(380px, 72vh, 1200px);
          width:500px; 
          top: 1%;
          left: 70%;
          transform: translateX(-50%);
          -webkit-mask-image: linear-gradient(
            to top,
            black 0%,
            black 42%,
            rgba(0,0,0,0.4) 70%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to top,
            black 0%,
            black 42%,
            rgba(0,0,0,0.4) 50%,
            transparent 100%
          );
        }
      `}</style>
    </>
  );
}
