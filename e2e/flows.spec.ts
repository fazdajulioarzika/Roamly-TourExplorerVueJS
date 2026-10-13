import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/tile.openstreetmap.org/**", (r) =>
    r.fulfill({ status: 404, body: "" })
  );
  // Mock API supaya tes stabil dan tidak bergantung jaringan
  await page.route("**/api.open-meteo.com/**", (r) =>
    r.fulfill({
      json: {
        current: {
          temperature_2m: 20,
          weather_code: 0,
          wind_speed_10m: 5,
          time: "2026-10-13T10:00",
        },
        current_units: { temperature_2m: "°C" },
        daily: {
          time: ["2026-10-13", "2026-10-14", "2026-10-15"],
          weather_code: [0, 1, 2],
          temperature_2m_max: [24, 23, 22],
          temperature_2m_min: [15, 14, 13],
        },
      },
    })
  );
  await page.route("**/api.unsplash.com/**", (r) =>
    r.fulfill({ status: 404, body: "{}" })
  );
});

test("home → destination detail", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Find your next escape." })
  ).toBeVisible();
  await page.locator('a[href="/destination/kyoto"]').first().click();
  await expect(page).toHaveURL(/destination\/kyoto/);
  await expect(
    page.getByRole("heading", { name: "Kyoto", level: 1 })
  ).toBeVisible();
});

test("favorite persists after refresh", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Save Kyoto to favorites" })
    .first()
    .click();
  await page.reload();
  await page.goto("/saved");
  await expect(page.getByRole("heading", { name: "Kyoto" })).toBeVisible();
});

test("trip: create → add item → refresh", async ({ page }) => {
  await page.goto("/trips");
  await page.getByLabel("Trip title").fill("Japan trip");
  await page.getByRole("button", { name: "Create trip" }).click();
  await page.getByLabel("Activity title").fill("Fushimi Inari");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.reload();
  await expect(page.getByText("Fushimi Inari")).toBeVisible();
});
test("trip: edit title", async ({ page }) => {
  await page.goto("/trips");
  await page.getByLabel("Trip title").fill("Old name");
  await page.getByRole("button", { name: "Create trip" }).click();
  await page.getByRole("button", { name: "Edit trip" }).click();
  await page.getByLabel("Trip title").fill("Japan 2027");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Japan 2027" })).toBeVisible();
});
test("destination shows map with marker", async ({ page }) => {
  await page.goto("/destination/kyoto");
  await expect(
    page.getByRole("region", { name: "Map of Kyoto" })
  ).toBeVisible();
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(1);
});
test("no horizontal overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const path of [
    "/",
    "/explore",
    "/destination/kyoto",
    "/trips",
    "/saved",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(overflow, `overflow on ${path}`).toBe(false);
  }
});

test("mobile menu opens and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
});
