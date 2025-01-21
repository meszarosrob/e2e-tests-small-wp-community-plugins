import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const messageFactory = () => {
	return `This is a comment, and it was created on ${ new Date() }`;
};

const cookieName = () => {
	const pluginCookieBaseName = 'comment_saver_post';
	const defaultPostId = 1;

	return `${ pluginCookieBaseName }${ defaultPostId }`;
};

test.use( {
	storageState: { cookies: [], origins: [] },
} );

test( 'The message input remains empty when there is no previously saved message', async ( {
	page,
	context,
} ) => {
	await page.goto( '/hello-world/' );

	// WP doesn't set any cookies, so this should be empty.
	await expect( await context.cookies() ).toHaveLength( 0 );
	await expect(
		page.getByRole( 'textbox', { name: 'Comment' } )
	).toHaveValue( '' );
} );

test( 'The previously saved message is applied when the post is loaded', async ( {
	page,
	context,
	baseURL,
} ) => {
	const message = messageFactory();

	// The cookie has to be set manually.
	await context.addCookies( [
		{
			name: cookieName(),
			value: encodeURIComponent( message ),
			path: '/',
			domain: new URL( baseURL ).hostname,
		},
	] );

	await page.goto( '/hello-world/' );

	await expect( await context.cookies() ).toMatchObject( [
		{
			name: cookieName(),
			value: encodeURIComponent( message ),
		},
	] );
	await expect(
		page.getByRole( 'textbox', { name: 'Comment' } )
	).toHaveValue( message );
} );

test( 'The message is saved when the comment is not submitted successfully', async ( {
	page,
	context,
} ) => {
	const message = messageFactory();

	await page.goto( '/hello-world/' );

	// The other required fields are left empty on purpose.
	await page.getByRole( 'textbox', { name: 'Comment' } ).fill( message );
	await page.getByRole( 'button', { name: 'Post Comment' } ).click();

	// https://github.com/WordPress/WordPress/blob/84e9601e5a2966c0aa80020bbf0c043dd8b6bfbb/wp-includes/comment.php#L3631
	await expect( page.locator( '.wp-die-message' ) ).toContainText(
		/Please fill the required fields/
	);
	await expect( await context.cookies() ).toMatchObject( [
		{
			name: cookieName(),
			value: encodeURIComponent( message ),
		},
	] );
} );

test( 'There is no saved message when the comment is submitted successfully', async ( {
	page,
	context,
} ) => {
	const message = messageFactory();

	await page.goto( '/hello-world/' );

	await page.getByRole( 'textbox', { name: 'Comment' } ).fill( message );
	await page.getByRole( 'textbox', { name: 'Name' } ).fill( 'John Doe' );
	await page
		.getByRole( 'textbox', { name: 'Email' } )
		.fill( 'john.doe@example.com' );
	await page.getByRole( 'button', { name: 'Post Comment' } ).click();

	await expect( page.url() ).toContain( '/hello-world/' );
	await expect(
		page.locator( '.wp-block-comment-content' ).last()
	).toContainText( message );
	await expect( await context.cookies() ).toHaveLength( 0 );
} );
