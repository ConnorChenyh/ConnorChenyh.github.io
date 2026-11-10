import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
export function launchBrowser() {
  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = process.env.CHROME_PATH || (process.platform === 'darwin' && existsSync(macChrome) ? macChrome : undefined);
  return chromium.launch({ executablePath, headless: true });
}
