import { defineConfig } from '@playwright/test';
import baseConfig from '@wordpress/scripts/config/playwright.config.js';

const testDir = process.env.PLUGIN
	? `tests/${ process.env.PLUGIN }/specs`
	: baseConfig.testDir;

export default defineConfig( {
	...baseConfig,
	testDir,
	webServer: null,
} );
