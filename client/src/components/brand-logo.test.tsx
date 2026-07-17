import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

type LogoModule = {
  BrandLogo: (props: { light?: boolean; compact?: boolean }) => React.ReactNode;
};

async function loadLogoModule(): Promise<LogoModule | null> {
  try {
    const path = "./brand-logo";
    return (await import(path)) as LogoModule;
  } catch {
    return null;
  }
}

describe("SafeTrip brand logo", () => {
  test("renders one reusable route mark with an accessible wordmark", async () => {
    const logoApi = await loadLogoModule();

    expect(logoApi).not.toBeNull();
    const markup = renderToStaticMarkup(logoApi!.BrandLogo({}));

    expect(markup).toContain('aria-label="SafeTrip"');
    expect(markup).toContain('data-logo-mark="route-s"');
    expect(markup).toContain("SafeTrip");
  });
});
