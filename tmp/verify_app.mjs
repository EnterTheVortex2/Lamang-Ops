import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/usr/local/share/bun-global/node_modules/playwright-core');

const URL = 'http://localhost:3000';

async function checkImages(page, label) {
  await page.waitForTimeout(700);
  const res = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const broken = [];
    const missingIcon = [];
    for (const img of imgs) {
      const style = window.getComputedStyle(img);
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && img.offsetParent !== null;
      if (!visible) continue;
      if (!img.complete || img.naturalWidth === 0) {
        broken.push({ alt: img.alt, src: img.src });
      }
      if (img.src.includes('Missing_icon.png')) {
        missingIcon.push({ alt: img.alt, src: img.src });
      }
    }
    return { totalVisible: imgs.filter(i => i.offsetParent !== null).length, broken, missingIcon };
  });
  console.log(`[IMG:${label}] visible=${res.totalVisible}, broken=${res.broken.length}, missingIcon=${res.missingIcon.length}`);
  if (res.broken.length > 0) console.log(`  Broken:`, res.broken.slice(0, 8));
  if (res.missingIcon.length > 0) console.log(`  Missing_icon:`, res.missingIcon.slice(0, 8));
  return res;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ============ 1. DESKTOP (1440x900) ============
  const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await deskCtx.newPage();
  page.on('pageerror', (err) => errors.push(`DESKTOP pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`DESKTOP console.error: ${msg.text()}`);
  });

  console.log('--- Navigating Desktop 1440x900 ---');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // Check Hideout Materials & Disassembly images + location naming
  await checkImages(page, 'desktop-hideout-default');
  await page.screenshot({ path: '/tmp/_verify_desktop_hideout.png' });

  // Switch Hideout sub-tab to Materials
  const materialsTab = page.getByRole('button', { name: /Materials/i }).first();
  if (await materialsTab.count()) {
    await materialsTab.click();
    await page.waitForTimeout(500);
    await checkImages(page, 'desktop-hideout-materials');
    const locCheck = await page.evaluate(() => {
      const txt = document.body.innerText;
      return {
        hasDotSep: txt.includes('·'),
        sample: txt.split('\n').filter(l => l.includes('·')).slice(0, 8),
      };
    });
    console.log('[LOCATIONS:materials]', locCheck.sample);
  }

  // Switch Hideout sub-tab to Disassembly
  const disTab = page.getByRole('button', { name: /Disassembly/i }).first();
  if (await disTab.count()) {
    await disTab.click();
    await page.waitForTimeout(500);
    await checkImages(page, 'desktop-hideout-disassembly');
  }

  // Switch to Tasks workspace & expand panel
  await page.getByRole('button', { name: /^Tasks/i }).first().click();
  await page.waitForTimeout(700);
  await checkImages(page, 'desktop-tasks-compact');

  const expandBtn = page.getByRole('button', { name: /Expand panel/i });
  if (await expandBtn.count()) {
    await expandBtn.click();
    await page.waitForTimeout(500);
  }
  const tasksExpandedCheck = await page.evaluate(() => {
    const grids = Array.from(document.querySelectorAll('div.grid.grid-cols-1'));
    const cols = grids.map(g => window.getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length);
    const vendorImgs = Array.from(document.querySelectorAll('img')).filter(img => {
      const rect = img.getBoundingClientRect();
      return img.offsetParent !== null && rect.width >= 80 && rect.height >= 80;
    }).map(img => ({ alt: img.alt, w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height, natW: img.naturalWidth }));
    return { gridCols: cols, largePortraits: vendorImgs };
  });
  console.log('[DESKTOP:tasks-expanded]', JSON.stringify(tasksExpandedCheck));
  await page.screenshot({ path: '/tmp/_verify_desktop_tasks_expanded.png' });

  // Compact panel back
  const compactBtn = page.getByRole('button', { name: /Compact panel/i });
  if (await compactBtn.count()) {
    await compactBtn.click();
    await page.waitForTimeout(400);
  }

  // Switch to Vendors workspace
  await page.getByRole('button', { name: /^Vendors/i }).first().click();
  await page.waitForTimeout(1500);
  const vendorCheck = await page.evaluate(() => {
    const largePortraits = Array.from(document.querySelectorAll('img')).filter(img => {
      const rect = img.getBoundingClientRect();
      return img.offsetParent !== null && rect.width >= 80 && rect.height >= 80;
    }).map(img => ({ alt: img.alt, w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height, natW: img.naturalWidth }));
    return { largePortraits };
  });
  console.log('[DESKTOP:vendors]', JSON.stringify(vendorCheck));
  await checkImages(page, 'desktop-vendors');
  await page.screenshot({ path: '/tmp/_verify_desktop_vendors.png' });

  // Switch to Keys workspace
  await page.getByRole('button', { name: /^Keys/i }).first().click();
  await page.waitForTimeout(700);
  await checkImages(page, 'desktop-keys');

  // Switch to Loadout (Weapon Builder) workspace
  await page.getByRole('button', { name: /^Loadout/i }).first().click();
  await page.waitForTimeout(800);
  await checkImages(page, 'desktop-loadout-default');

  // Test all 5 weapon class tabs
  for (const clsLabel of ['Assault Rifle', 'SMG', 'Rifle', 'Shotgun', 'Pistol']) {
    const btn = page.locator('button', { hasText: clsLabel }).first();
    if (await btn.count()) {
      await btn.click();
      await page.waitForTimeout(200);
      const countText = await btn.innerText();
      console.log(`[LOADOUT:class] ${countText.replace(/\n/g, ' ')}`);
    }
  }

  // Filter Assault Rifle & search M4A1
  await page.locator('button', { hasText: 'Assault Rifle' }).first().click();
  const searchBox = page.getByPlaceholder(/Search weapons/i);
  await searchBox.fill('M4A1');
  await page.waitForTimeout(300);
  await page.locator('button', { hasText: 'M4A1' }).first().click();
  await page.waitForTimeout(400);

  // Strip mods first so we can test dependency chain installation for Light / Laser
  const stripBtn = page.getByRole('button', { name: /Strip Mods/i });
  if (await stripBtn.count()) {
    await stripBtn.click();
    await page.waitForTimeout(300);
  }
  const lightLaserChip = page.getByRole('button', { name: /Light \/ Laser/i }).first();
  await lightLaserChip.click();
  await page.waitForTimeout(300);

  const installChainBtn = page.getByRole('button', { name: /Install Chain/i }).first();
  if (await installChainBtn.count()) {
    await installChainBtn.click();
    await page.waitForTimeout(300);
    console.log('[LOADOUT:install-chain] Clicked Install Chain for Light/Laser!');
  } else {
    console.log('[LOADOUT:install-chain] Direct equip buttons count:', await page.getByRole('button', { name: /Equip/i }).count());
  }

  // Save Loadout Preset
  const saveInput = page.getByPlaceholder(/Preset name/i);
  if (await saveInput.count()) {
    await saveInput.fill('Night M4 Test');
    await page.getByRole('button', { name: /Save Build/i }).click();
    await page.waitForTimeout(400);
  }
  const savedFound = await page.locator('text=Night M4 Test').count();
  console.log('[LOADOUT:saved-preset-visible]', savedFound > 0);
  await page.screenshot({ path: '/tmp/_verify_desktop_loadout.png' });

  // Switch Operator slot to 2 and back to 1 to verify per-operator isolation & persistence
  const opBtn = page.getByRole('button', { name: /Switch operator profile/i });
  await opBtn.click();
  await page.waitForTimeout(250);
  await page.locator('button', { hasText: /Operator 2/i }).first().click();
  await page.waitForTimeout(350);
  const savedInOp2 = await page.locator('text=Night M4 Test').count();
  await opBtn.click();
  await page.waitForTimeout(250);
  await page.locator('button', { hasText: /Operator 1/i }).first().click();
  await page.waitForTimeout(350);
  const savedBackInOp1 = await page.locator('text=Night M4 Test').count();
  console.log(`[LOADOUT:operator-isolation] op2=${savedInOp2}, op1Restored=${savedBackInOp1}`);

  // ============ 2. MOBILE (390x844) ============
  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobCtx.newPage();
  mPage.on('pageerror', (err) => errors.push(`MOBILE pageerror: ${err.message}`));
  mPage.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`MOBILE console.error: ${msg.text()}`);
  });

  console.log('--- Navigating Mobile 390x844 ---');
  await mPage.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(1500);

  const checkMobileOverflowAndChrome = async (tabLabel) => {
    await mPage.waitForTimeout(450);
    const m = await mPage.evaluate(() => {
      const header = document.querySelector('header');
      const nav = document.querySelector('nav[aria-label="Mobile navigation"]');
      const hRect = header ? header.getBoundingClientRect().height : 0;
      const nRect = nav ? nav.getBoundingClientRect().height : 0;
      return {
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        headerH: Math.round(hRect),
        navH: Math.round(nRect),
        stickyPct: Number((((hRect + nRect) / window.innerHeight) * 100).toFixed(1)),
      };
    });
    console.log(`[MOBILE:${tabLabel}] overflow=${m.scrollW > m.innerW} (${m.scrollW}/${m.innerW}), chrome=${m.headerH}+${m.navH}=${m.headerH+m.navH}px (${m.stickyPct}%)`);
    return m;
  };

  await checkMobileOverflowAndChrome('hideout');
  await checkImages(mPage, 'mobile-hideout');
  await mPage.screenshot({ path: '/tmp/_verify_mobile_hideout.png' });

  // Mobile Tasks
  await mPage.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Tasks' }).click();
  await checkMobileOverflowAndChrome('tasks');
  await checkImages(mPage, 'mobile-tasks');
  await mPage.screenshot({ path: '/tmp/_verify_mobile_tasks.png' });

  // Mobile Loadout
  await mPage.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Loadout' }).click();
  await checkMobileOverflowAndChrome('loadout');
  await checkImages(mPage, 'mobile-loadout');
  await mPage.screenshot({ path: '/tmp/_verify_mobile_loadout.png' });

  // Mobile Vendors
  await mPage.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Vendors' }).click();
  await mPage.waitForTimeout(1000);
  await checkMobileOverflowAndChrome('vendors');
  const mobVendorPortrait = await mPage.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).filter(img => {
      const r = img.getBoundingClientRect();
      return img.offsetParent !== null && r.width >= 76 && r.height >= 76;
    }).map(img => ({ alt: img.alt, w: Math.round(img.getBoundingClientRect().width), h: Math.round(img.getBoundingClientRect().height), natW: img.naturalWidth }));
  });
  console.log('[MOBILE:vendor-portrait]', JSON.stringify(mobVendorPortrait));
  await checkImages(mPage, 'mobile-vendors');
  await mPage.screenshot({ path: '/tmp/_verify_mobile_vendors.png' });

  // Mobile Map
  await mPage.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Map' }).click();
  await checkMobileOverflowAndChrome('map');
  await mPage.screenshot({ path: '/tmp/_verify_mobile_map.png' });

  // Mobile Operations Menu -> Keys & Privacy
  await mPage.getByRole('button', { name: /Open tactical menu/i }).click();
  await mPage.waitForTimeout(300);
  await mPage.screenshot({ path: '/tmp/_verify_mobile_menu.png' });
  await mPage.getByRole('button', { name: /Keys & Locked Doors/i }).click();
  await checkMobileOverflowAndChrome('keys');
  await checkImages(mPage, 'mobile-keys');

  await mPage.getByRole('button', { name: /Open tactical menu/i }).click();
  await mPage.waitForTimeout(300);
  await mPage.getByRole('button', { name: /Privacy Notice, Legal & Data/i }).click();
  await checkMobileOverflowAndChrome('legal');

  console.log('=== ERRORS ===', errors.length, errors);
  await browser.close();
  if (errors.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
