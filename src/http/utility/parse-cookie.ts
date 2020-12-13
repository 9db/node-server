import CookieAttribute from 'http/enum/cookie-attribute';

type CookieValue = string | boolean;

type ParsedCookie = {
	[key in CookieAttribute]?: CookieValue;
}

const SUPPORTED_ATTRIBUTES = Object.values(CookieAttribute);

function parseCookiePart(cookie_part: string): [CookieAttribute, CookieValue] | null {
	const delimiter_index = cookie_part.indexOf('=');

	let cookie_attribute;
	let cookie_value;

	if (delimiter_index === -1) {
		cookie_attribute = cookie_part;
		cookie_value = true;
	} else {
		cookie_attribute = cookie_part.slice(0, delimiter_index);
		cookie_value = cookie_part.slice(delimiter_index + 1).trim();
	}

	cookie_attribute = cookie_attribute.trim() as CookieAttribute;

	if (!SUPPORTED_ATTRIBUTES.includes(cookie_attribute)) {
		return null;
	}

	return [cookie_attribute, cookie_value];
}

function parseCookie(cookie: string): ParsedCookie {
	const parts = cookie.split(';');
	const result: ParsedCookie = {};

	parts.forEach((part) => {
		const tuple = parseCookiePart(part);

		if (tuple === null) {
			return;
		}

		const [cookie_attribute, cookie_value] = tuple;

		result[cookie_attribute] = cookie_value;
	});

	return result;
}

export default parseCookie;
