import { URL } from 'url';

function valueIsUrl(value: unknown): boolean {
	if (typeof value !== 'string') {
		return false;
	}

	try {
		new URL(value);
	} catch (error) {
		return false;
	}

	return true;
}

export default valueIsUrl;
