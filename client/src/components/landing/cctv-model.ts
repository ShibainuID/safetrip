import {
  BoxGeometry,
  CapsuleGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from "three";

function physical(color: string, metalness: number, roughness: number) {
  return new MeshPhysicalMaterial({ color, metalness, roughness });
}

export function createCctvModel() {
  const camera = new Group();
  camera.name = "cctv-camera";
  camera.rotation.set(-0.08, -0.18, -0.06);

  const darkMetal = new MeshPhysicalMaterial({
    color: "#10151d",
    metalness: 0.78,
    roughness: 0.3,
    clearcoat: 0.18,
    clearcoatRoughness: 0.42,
  });
  const shell = new MeshPhysicalMaterial({
    color: "#cbd2db",
    metalness: 0.38,
    roughness: 0.42,
    clearcoat: 0.34,
    clearcoatRoughness: 0.3,
  });
  const shellEdge = new MeshPhysicalMaterial({
    color: "#8f99a7",
    metalness: 0.58,
    roughness: 0.36,
    clearcoat: 0.22,
  });
  const mountMaterial = new MeshPhysicalMaterial({
    color: "#151b24",
    metalness: 0.82,
    roughness: 0.33,
    clearcoat: 0.15,
  });
  const rubber = new MeshPhysicalMaterial({
    color: "#080a0e",
    metalness: 0,
    roughness: 0.86,
  });
  const fastenerMaterial = new MeshPhysicalMaterial({
    color: "#89929e",
    metalness: 0.94,
    roughness: 0.22,
  });

  const body = new Mesh(new CapsuleGeometry(0.68, 1.92, 12, 36), darkMetal);
  body.name = "cctv-body";
  body.rotation.z = Math.PI / 2;
  body.scale.z = 0.82;
  body.castShadow = true;
  camera.add(body);

  const hood = new Mesh(
    new CylinderGeometry(0.82, 0.82, 3.35, 64, 1, true, -Math.PI / 2, Math.PI),
    new MeshPhysicalMaterial({
      color: "#cbd2db",
      metalness: 0.38,
      roughness: 0.42,
      clearcoat: 0.34,
      clearcoatRoughness: 0.3,
      side: DoubleSide,
    }),
  );
  hood.name = "cctv-shell";
  hood.position.set(-0.12, 0.02, 0);
  hood.rotation.z = Math.PI / 2;
  hood.scale.z = 0.85;
  hood.castShadow = true;
  camera.add(hood);

  for (const [x, width] of [
    [-1.03, 0.46],
    [1.03, 0.46],
  ] as const) {
    const collar = new Mesh(
      new CylinderGeometry(0.735, 0.735, width, 48),
      shell,
    );
    collar.position.x = x;
    collar.rotation.z = Math.PI / 2;
    collar.scale.z = 0.82;
    collar.castShadow = true;
    camera.add(collar);
  }

  const frontFrame = new Mesh(
    new CylinderGeometry(0.65, 0.68, 0.14, 64),
    shell,
  );
  frontFrame.position.x = -1.38;
  frontFrame.rotation.z = Math.PI / 2;
  frontFrame.scale.z = 0.86;
  frontFrame.castShadow = true;
  camera.add(frontFrame);

  const frontFace = new Mesh(
    new CylinderGeometry(0.57, 0.6, 0.12, 64),
    new MeshPhysicalMaterial({
      color: "#03060b",
      metalness: 0.08,
      roughness: 0.28,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
    }),
  );
  frontFace.name = "cctv-front-face";
  frontFace.position.x = -1.47;
  frontFace.rotation.z = Math.PI / 2;
  frontFace.scale.z = 0.86;
  camera.add(frontFace);

  const lensBarrel = new Mesh(
    new CylinderGeometry(0.185, 0.22, 0.15, 48),
    new MeshPhysicalMaterial({
      color: "#07090d",
      metalness: 0.76,
      roughness: 0.18,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
    }),
  );
  lensBarrel.name = "cctv-lens";
  lensBarrel.position.set(-1.56, 0, 0);
  lensBarrel.rotation.z = Math.PI / 2;
  camera.add(lensBarrel);

  const lensRim = new Mesh(
    new TorusGeometry(0.225, 0.032, 16, 64),
    shellEdge,
  );
  lensRim.position.set(-1.64, 0, 0);
  lensRim.rotation.y = Math.PI / 2;
  camera.add(lensRim);

  const lensGlass = new Mesh(
    new SphereGeometry(0.145, 40, 24),
    new MeshPhysicalMaterial({
      color: "#07111f",
      emissive: "#031229",
      emissiveIntensity: 0.32,
      roughness: 0.045,
      metalness: 0,
      transmission: 0.58,
      thickness: 0.24,
      ior: 1.5,
      attenuationColor: "#0a2e59",
      attenuationDistance: 0.72,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
  );
  lensGlass.name = "cctv-lens-glass";
  lensGlass.scale.x = 0.18;
  lensGlass.position.set(-1.65, 0, 0);
  camera.add(lensGlass);

  const infraredMaterial = new MeshPhysicalMaterial({
    color: "#4d5a68",
    emissive: "#162a40",
    emissiveIntensity: 0.28,
    metalness: 0.12,
    roughness: 0.24,
    clearcoat: 0.72,
  });
  const redLightMaterial = new MeshStandardMaterial({
    color: "#e0002d",
    emissive: "#ff002f",
    emissiveIntensity: 1.85,
    roughness: 0.26,
  });
  for (let index = 0; index < 14; index += 1) {
    const angle = (index / 14) * Math.PI * 2;
    const isStatusLight = index === 7;
    const infrared = new Mesh(
      new SphereGeometry(isStatusLight ? 0.052 : 0.034, 18, 18),
      isStatusLight ? redLightMaterial : infraredMaterial,
    );
    infrared.position.set(-1.54, Math.cos(angle) * 0.39, Math.sin(angle) * 0.39);
    infrared.scale.x = 0.22;
    camera.add(infrared);
  }

  const rearCap = new Mesh(new CylinderGeometry(0.69, 0.69, 0.16, 48), shell);
  rearCap.position.x = 1.38;
  rearCap.rotation.z = Math.PI / 2;
  rearCap.scale.z = 0.82;
  rearCap.castShadow = true;
  camera.add(rearCap);

  for (const [index, x] of [-1.405, 1.405].entries()) {
    const seal = new Mesh(new TorusGeometry(0.635, 0.026, 12, 64), rubber);
    seal.name = index === 0 ? "cctv-rubber-seal" : "";
    seal.position.x = x;
    seal.rotation.y = Math.PI / 2;
    seal.scale.z = 0.86;
    camera.add(seal);
  }

  const cradle = new Mesh(new BoxGeometry(0.68, 0.38, 0.58), mountMaterial);
  cradle.name = "cctv-mount";
  cradle.position.set(0.36, -0.72, 0);
  cradle.castShadow = true;
  camera.add(cradle);

  const pivot = new Mesh(new CylinderGeometry(0.18, 0.18, 0.82, 28), mountMaterial);
  pivot.position.set(0.36, -1.18, 0);
  pivot.castShadow = true;
  camera.add(pivot);

  const base = new Mesh(new CylinderGeometry(0.28, 0.32, 0.24, 32), shellEdge);
  base.position.set(0.36, -1.69, 0);
  camera.add(base);

  for (const [index, z] of [-0.31, 0.31].entries()) {
    const fastener = new Mesh(
      new CylinderGeometry(0.075, 0.075, 0.035, 20),
      fastenerMaterial,
    );
    fastener.name = index === 0 ? "cctv-fastener" : "";
    fastener.position.set(0.36, -0.73, z);
    fastener.rotation.x = Math.PI / 2;
    camera.add(fastener);
  }

  const light = new Mesh(
    new SphereGeometry(0.055, 20, 20),
    new MeshStandardMaterial({
      color: "#ff304f",
      emissive: "#ff173d",
      emissiveIntensity: 5,
    }),
  );
  light.name = "cctv-status-light";
  light.position.set(1.31, -0.14, 0.36);
  camera.add(light);

  const cableCurve = new CatmullRomCurve3([
    new Vector3(0.15, -0.76, -0.24),
    new Vector3(-0.16, -1.02, -0.42),
    new Vector3(-0.08, -1.46, -0.3),
    new Vector3(0.2, -1.61, -0.12),
  ]);
  const cable = new Mesh(new TubeGeometry(cableCurve, 32, 0.035, 10), darkMetal);
  camera.add(cable);

  for (const side of [-1, 1]) {
    for (let index = 0; index < 3; index += 1) {
      const vent = new Mesh(new BoxGeometry(0.18, 0.025, 0.28), darkMetal);
      vent.position.set(side * 1.05, 0.18 - index * 0.1, 0.66);
      camera.add(vent);
    }
  }

  camera.traverse((part) => {
    if (!(part instanceof Mesh)) return;
    part.castShadow = true;
    part.receiveShadow = true;
  });

  return camera;
}
