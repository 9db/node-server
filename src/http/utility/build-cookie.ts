import CookieAttribute from 'http/enum/cookie-attribute';

function buildCookie(session_key: string, duration: number): string {
	const expiration_timestamp = Date.now() + duration;
	const expiration_date = new Date(expiration_timestamp);
	const expiration_string = expiration_date.toUTCString();

	const cookie_parts = [
		`${CookieAttribute.SESSION}=${session_key}`,
		`${CookieAttribute.PATH}=/`,
		`${CookieAttribute.EXPIRES}=${expiration_string}`,
		`${CookieAttribute.SAMESITE}=none`,
		CookieAttribute.HTTPONLY,
		CookieAttribute.SECURE
	];

	return cookie_parts.join('; ');
}

export default buildCookie;
