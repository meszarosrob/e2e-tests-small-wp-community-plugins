<?php
/**
 * Disables comment flood throttling.
 *
 * When E2E tests are re-run within a short period, multiple comments are created.
 * This behavior might be identified by WordPress as comment flooding.
 *
 * @package comment-saver
 */

declare(strict_types=1);

namespace E2E\CommentSaver;

remove_filter(
	'comment_flood_filter',
	'wp_throttle_comment_flood'
);
