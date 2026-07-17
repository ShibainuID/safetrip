"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  PCFShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  ShadowMaterial,
  SpotLight,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createCctvModel } from "./cctv-model";
import { getCctvPose } from "./cctv-motion";

function disposeGroup(group: Group) {
  group.traverse((object) => {
    if (!("geometry" in object)) return;
    const mesh = object as unknown as {
      geometry?: { dispose: () => void };
      material?: { dispose: () => void } | Array<{ dispose: () => void }>;
    };
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material.dispose());
    } else {
      mesh.material?.dispose();
    }
  });
}

export function CctvScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: WebGLRenderer;
    let animationFrame = 0;
    let isVisible = true;
    let pointerY = 0;

    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.setClearColor(new Color("#071328"), 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const environmentGenerator = new PMREMGenerator(renderer);
    const environment = environmentGenerator.fromScene(new RoomEnvironment()).texture;
    scene.environment = environment;
    environmentGenerator.dispose();

    const camera = new PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.05, 7.6);

    const model = createCctvModel();
    model.scale.setScalar(1.22);
    model.position.x = 0.2;

    const turntable = new Group();
    turntable.add(model);
    scene.add(turntable);

    const hemisphere = new HemisphereLight("#d8e4f4", "#05070b", 1.65);
    scene.add(hemisphere);

    const key = new SpotLight("#f3f7ff", 72, 18, Math.PI / 5.5, 0.48, 1.4);
    key.position.set(-4, 5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    scene.add(key);

    const cobalt = new DirectionalLight("#376ed8", 1.35);
    cobalt.position.set(4, 1, 3);
    scene.add(cobalt);

    const ambient = new AmbientLight("#7892b8", 0.72);
    scene.add(ambient);

    const shadow = new Mesh(
      new PlaneGeometry(4.8, 3.8),
      new ShadowMaterial({ color: "#02050b", opacity: 0.28 }),
    );
    shadow.position.set(0.2, -2.02, 0);
    shadow.rotation.x = -Math.PI / 2;
    shadow.receiveShadow = true;
    scene.add(shadow);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      model.scale.setScalar(width < 620 ? 0.92 : 1.22);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.02 });
    intersectionObserver.observe(host);

    const handlePointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    host.addEventListener("pointermove", handlePointer, { passive: true });

    const render = (time: number) => {
      if (isVisible) {
        const seconds = time * 0.001;
        const still = reduceMotion.matches;
        const pose = getCctvPose({ seconds, pointerY, reduceMotion: still });
        turntable.rotation.y = pose.yaw;
        turntable.rotation.x = still
          ? pose.pitch
          : MathUtils.lerp(turntable.rotation.x, pose.pitch, 0.045);
        model.position.y = pose.lift;
        renderer.render(scene, camera);
      }
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      host.removeEventListener("pointermove", handlePointer);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      disposeGroup(model);
      shadow.geometry.dispose();
      shadow.material.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative h-full min-h-[360px] w-full md:min-h-[560px]"
      role="img"
      aria-label="Interactive three-dimensional SafeTrip CCTV camera"
    />
  );
}
