import TimeInterval from 'enum/time-interval';
import CookieAttribute from 'http/enum/cookie-attribute';

function buildCookie(session_key: string): string {
	const milliseconds = Date.now() + TimeInterval.ONE_DAY;
	const expiration_timestamp = new Date(milliseconds).toUTCString();

	const cookie_parts = [
		`${CookieAttribute.SESSION}=${session_key}`,
		`${CookieAttribute.PATH}=/`,
		`${CookieAttribute.EXPIRES}=${expiration_timestamp}`,
		`${CookieAttribute.SAMESITE}=none`,
		CookieAttribute.HTTPONLY,
		CookieAttribute.SECURE
	];

	return cookie_parts.join('; ');
}

export default buildCookie;
