import { test as base, expect } from '@wordpress/e2e-test-utils-playwright';

import { WpGuestBar } from './wp-guest-bar';

const test = base.extend< {
	wpGuestBar: WpGuestBar;
} >( {
	async wpGuestBar( { requestUtils }, use ) {
		await use( new WpGuestBar( requestUtils ) );
	},
} );

export { test, expect };
