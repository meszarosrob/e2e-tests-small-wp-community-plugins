<?php
/**
 * REST API endpoint for managing the WP Guest Bar.
 *
 * The plugin's options need to be modified to account for all use cases.
 * Having an endpoint to do so makes this process more convenient in E2E tests.
 *
 * @package wp-guest-bar
 */

declare(strict_types=1);

namespace E2E\WpGuestBar;

use WP_REST_Request;
use WP_REST_Server;

const REST_NAMESPACE = '/e2e/v1';
const REST_ROUTE     = '/wp-guest-bar';
const OPTION_KEY     = 'wpgov_wpgb'; // Option defined in the plugin.

add_action(
	'rest_api_init',
	function () {
		$is_user_likely_admin = fn() => current_user_can( 'manage_options' );

		register_rest_route(
			REST_NAMESPACE,
			REST_ROUTE,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => fn() => get_option( OPTION_KEY ),
				'permission_callback' => $is_user_likely_admin,
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			REST_ROUTE,
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				// The validation is skipped on purpose.
				'callback'            => fn( WP_REST_Request $request ) => update_option(
					OPTION_KEY,
					json_decode( $request->get_body(), true )
				),
				'permission_callback' => $is_user_likely_admin,
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			REST_ROUTE,
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => fn() => delete_option( OPTION_KEY ),
				'permission_callback' => $is_user_likely_admin,
			)
		);
	}
);
