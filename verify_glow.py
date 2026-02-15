import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Wait for the dev server to be ready
        try:
            await page.goto("http://localhost:8080", timeout=30000)
        except:
            print("Server not ready, retrying...")
            await asyncio.sleep(5)
            await page.goto("http://localhost:8080")

        # Check if .golden-orb elements exist
        orbs = await page.query_selector_all(".golden-orb")
        print(f"Found {len(orbs)} golden orbs")

        # Take a screenshot
        await page.screenshot(path="/home/jules/verification/final_glow.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
