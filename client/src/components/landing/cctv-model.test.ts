import { describe, expect, test } from "bun:test";
import { Mesh, MeshPhysicalMaterial, type Group } from "three";

type ModelModule = {
  createCctvModel: () => Group;
};

async function loadModelModule(): Promise<ModelModule | null> {
  try {
    const path = "./cctv-model";
    return (await import(path)) as ModelModule;
  } catch {
    return null;
  }
}

describe("procedural CCTV model", () => {
  test("exposes the named parts needed by the hero animation", async () => {
    const modelApi = await loadModelModule();

    expect(modelApi).not.toBeNull();
    const model = modelApi!.createCctvModel();
    const names = new Set<string>();
    model.traverse((part) => names.add(part.name));

    expect(names).toContain("cctv-body");
    expect(names).toContain("cctv-lens");
    expect(names).toContain("cctv-mount");
    expect(names).toContain("cctv-status-light");
  });

  test("uses distinct manufactured materials for shell, seals, optics, and hardware", async () => {
    const modelApi = await loadModelModule();

    expect(modelApi).not.toBeNull();
    const model = modelApi!.createCctvModel();
    const parts = new Map<string, Mesh>();
    model.traverse((part) => {
      if (part instanceof Mesh && part.name) parts.set(part.name, part);
    });

    const shell = parts.get("cctv-shell")!;
    const seal = parts.get("cctv-rubber-seal")!;
    const fastener = parts.get("cctv-fastener")!;
    const lensGlass = parts.get("cctv-lens-glass")!;

    expect(shell).toBeDefined();
    expect(seal).toBeDefined();
    expect(fastener).toBeDefined();
    expect(lensGlass).toBeDefined();

    const shellMaterial = shell.material as MeshPhysicalMaterial;
    const sealMaterial = seal.material as MeshPhysicalMaterial;
    const fastenerMaterial = fastener.material as MeshPhysicalMaterial;
    const lensMaterial = lensGlass.material as MeshPhysicalMaterial;

    expect(shellMaterial.metalness).toBeLessThan(0.6);
    expect(shellMaterial.roughness).toBeGreaterThan(0.3);
    expect(sealMaterial.metalness).toBe(0);
    expect(sealMaterial.roughness).toBeGreaterThan(0.7);
    expect(fastenerMaterial.metalness).toBeGreaterThan(0.85);
    expect(lensMaterial.transmission).toBeGreaterThan(0.25);
    expect(lensMaterial.ior).toBeCloseTo(1.5, 1);
  });
});
