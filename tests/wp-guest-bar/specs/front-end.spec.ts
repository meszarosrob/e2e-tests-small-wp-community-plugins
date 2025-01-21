import { test, expect } from '../test-utils';

test.beforeAll( async ( { requestUtils } ) => {
	await requestUtils.activatePlugin( 'wp-guest-bar' );
} );

test.describe( 'Visitor', () => {
	test.use( {
		storageState: { cookies: [], origins: [] },
	} );

	test( 'An admin bar with a login link is displayed', async ( { page } ) => {
		await page.goto( '/' );

		const adminBar = page.locator( '#wpadminbar' );
		const loginLink = adminBar.getByRole( 'menuitem', { name: 'Log In' } );

		await expect( adminBar ).toBeVisible();
		await expect( loginLink ).toBeVisible();
		await expect( loginLink ).toHaveAttribute( 'href', /wp-login.php/ );
	} );

	test( 'When set, a custom message is displayed in the admin bar', async ( {
		page,
		wpGuestBar,
	} ) => {
		await wpGuestBar.setCustomMessage( 'Sic vita est!' );

		await page.goto( '/' );

		const customMessageItem = page.getByText( 'Sic vita est!' );

		await expect( customMessageItem ).toBeVisible();
	} );

	test( 'When none set, no custom message is displayed in the admin bar', async ( {
		page,
		wpGuestBar,
	} ) => {
		await wpGuestBar.deleteCustomMessage();

		await page.goto( '/' );

		const customMessageItem = page.locator( '#wp-admin-bar-wpgb-message' );

		await expect( customMessageItem ).not.toBeVisible();
	} );

	test( 'The custom message in the admin bar supports HTML and styling', async ( {
		page,
		wpGuestBar,
	} ) => {
		await wpGuestBar.setCustomMessage(
			'<span style="color: rgb(255, 0, 0)"><em>Sic</em> vita est!</span>'
		);

		await page.goto( '/' );

		const customMessageItem = page.getByText( 'Sic vita est!' );
		const emphasis = customMessageItem.getByRole( 'emphasis' );

		await expect( emphasis ).toBeVisible();
		await expect( customMessageItem ).toHaveCSS(
			'color',
			'rgb(255, 0, 0)'
		);
	} );
} );

test.describe( 'Logged in', () => {
	test( 'The default admin bar is displayed', async ( { page } ) => {
		await page.goto( '/' );

		const adminBar = page.locator( '#wpadminbar' );
		// The howdy greeting is displayed for logged-in users.
		const profileLink = adminBar.getByRole( 'menuitem', { name: 'Howdy' } );

		await expect( adminBar ).toBeVisible();
		await expect( profileLink ).toBeVisible();
		await expect( profileLink ).toHaveAttribute(
			'href',
			/wp-admin\/profile.php/
		);
	} );
} );
