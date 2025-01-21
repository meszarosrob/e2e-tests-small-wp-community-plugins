import { test, expect } from '../test-utils';

test.use( {
	storageState: { cookies: [], origins: [] },
} );

test( 'No admin bar appears on the front end when the plugin is inactive', async ( {
	page,
	requestUtils,
} ) => {
	await requestUtils.deactivatePlugin( 'wp-guest-bar' );

	await page.goto( '/' );

	const adminBar = page.locator( '#wpadminbar' );

	await expect( adminBar ).not.toBeVisible();
} );
