let browser = null
let page = null

async function ensureBrowser() {
  if (!browser) {
    const { chromium } = await import('playwright')
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    page = await context.newPage()
  }
  return page
}

export async function browserAction(action, options = {}) {
  try {
    const p = await ensureBrowser()

    switch (action) {
      case 'openUrl': {
        await p.goto(options.url, { waitUntil: 'networkidle' })
        return { success: true, result: `Navigated to ${options.url}` }
      }
      case 'click': {
        await p.click(options.selector)
        return { success: true, result: `Clicked ${options.selector}` }
      }
      case 'fill': {
        await p.fill(options.selector, options.value)
        return { success: true, result: `Filled ${options.selector} with value` }
      }
      case 'screenshot': {
        await p.screenshot({ path: options.path, fullPage: true })
        return { success: true, result: 'Screenshot taken', screenshotPath: options.path }
      }
      case 'assertText': {
        const element = await p.locator(options.selector)
        const text = await element.textContent()
        const passed = text && text.includes(options.text)
        return {
          success: passed,
          result: passed
            ? `Text "${options.text}" found in ${options.selector}`
            : `Expected "${options.text}" but got "${text}"`
        }
      }
      case 'assertUrl': {
        const currentUrl = p.url()
        const passed = currentUrl.includes(options.expectedUrl)
        return {
          success: passed,
          result: passed
            ? `URL matches: ${currentUrl}`
            : `Expected URL containing "${options.expectedUrl}" but got "${currentUrl}"`
        }
      }
      default:
        return { success: false, result: null, error: `Unknown action: ${action}` }
    }
  } catch (error) {
    return { success: false, result: null, error: error.message }
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close()
    browser = null
    page = null
  }
}

export const schemas = [
  {
    name: 'browser_action',
    description: 'Performs Playwright browser actions: openUrl, click, fill, screenshot, assertText, assertUrl',
    input_schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['openUrl', 'click', 'fill', 'screenshot', 'assertText', 'assertUrl'],
          description: 'Browser action to perform'
        },
        options: {
          type: 'object',
          description: 'Action options: url, selector, value, path, text, expectedUrl',
          properties: {
            url: { type: 'string' },
            selector: { type: 'string' },
            value: { type: 'string' },
            path: { type: 'string' },
            text: { type: 'string' },
            expectedUrl: { type: 'string' }
          }
        }
      },
      required: ['action']
    }
  }
]
