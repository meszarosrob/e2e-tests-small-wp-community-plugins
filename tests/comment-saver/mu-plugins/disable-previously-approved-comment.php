<?php
/**
 * Disables previously approved comment.
 *
 * By default, a comment author must have at least one previously approved comment.
 * It is more convenient not to have this restriction for E2E tests.
 *
 * @package comment-saver
 */

declare(strict_types=1);

namespace E2E\CommentSaver;

add_filter(
    'option_comment_previously_approved',
	'__return_false'
);
