import { RequestUtils } from '@wordpress/e2e-test-utils-playwright';

export class WpGuestBar {
	readonly restApiEndpointPath: string = '/e2e/v1/wp-guest-bar'; // Endpoint defined in the mu-plugin.
	requestUtils: RequestUtils;

	constructor( requestUtils: RequestUtils ) {
		this.requestUtils = requestUtils;
	}

	async customMessage() {
		return await this.requestUtils.rest( {
			path: this.restApiEndpointPath,
			method: 'GET',
		} );
	}

	async setCustomMessage( message: string ) {
		return await this.requestUtils.rest( {
			path: this.restApiEndpointPath,
			method: 'POST',
			data: {
				message,
			},
		} );
	}

	async deleteCustomMessage() {
		return await this.requestUtils.rest( {
			path: this.restApiEndpointPath,
			method: 'DELETE',
		} );
	}
}
