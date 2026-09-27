import { chromium } from 'playwright'
import { mkdir, rename, unlink } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'http://127.0.0.1:5173'
const outDir = '/opt/cursor/artifacts'
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
})
const page = await context.newPage()

async function shot(name) {
  const file = path.join(outDir, `${name}.png`)
  await page.screenshot({ path: file, fullPage: false })
  console.log('screenshot', file)
}

async function signIn(email, password) {
  await page.goto(`${BASE}/auth`)
  await page.getByRole('tablist').getByRole('button', { name: 'Sign in' }).click()
  await page.fill('#auth-email', email)
  await page.fill('#auth-password', password)
  await page.locator('form.app-form button[type="submit"]').click()
  await page.waitForFunction(() => location.pathname.startsWith('/app'), null, {
    timeout: 15000,
  })
}

try {
  await page.goto(BASE)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('#hero-brand')
  await shot('landing_hero')

  await signIn('jordan@pathly.demo', 'pathly123')
  await page.goto(`${BASE}/app/feed`)
  await page.waitForSelector('.campaign-tile')
  await shot('creator_feed')

  await page.getByRole('link', { name: 'Details' }).first().click()
  await page.waitForSelector('role=button[name="Join campaign"]')
  await page.getByRole('button', { name: 'Join campaign' }).click()
  await page.waitForFunction(() => location.pathname.includes('/app/chat/'))
  await page.fill(
    '#chat-input',
    'Hi Harbor — I’d love to shoot Saturday. My rate for a 40s reel is $150.',
  )
  await page.getByRole('button', { name: 'Send' }).click()
  await page.waitForSelector('.chat-bubble--mine')
  await shot('creator_chat_after_join')

  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.waitForFunction(() => !location.pathname.startsWith('/app'))

  await signIn('maya@harbor.demo', 'pathly123')
  await page.goto(`${BASE}/app/business`)
  await page.waitForSelector('text=/join/')
  await shot('business_dashboard_with_join')

  await page.getByRole('link', { name: /Open chat/i }).first().click()
  await page.waitForFunction(() => location.pathname.includes('/app/chat/'))
  await page.waitForSelector('text=/love to shoot Saturday/')
  await page.fill('#chat-input', 'Saturday 10am works. Looking forward to it!')
  await page.getByRole('button', { name: 'Send' }).click()
  await page.waitForSelector('text=/Saturday 10am works/')
  await shot('business_chat_reply')

  console.log('SMOKE_OK')
} catch (err) {
  console.error('SMOKE_FAIL', err)
  await shot('smoke_failure')
  process.exitCode = 1
} finally {
  const video = page.video()
  await context.close()
  await browser.close()
  if (video) {
    const raw = await video.path()
    const dest = path.join(outDir, 'pathly_join_chat_loop.webm')
    try {
      await unlink(dest)
    } catch {
      /* ignore */
    }
    await rename(raw, dest)
    console.log('video', dest)
  }
}
