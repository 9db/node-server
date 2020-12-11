import HeaderMap from 'http/type/header-map';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import fetchBuffer from 'http/utility/fetch-buffer';

interface ResponseData {
	body: string;
	headers: HeaderMap;
	status_code: StatusCode;
}

async function fetchPlaintext(url: string): Promise<ResponseData> {
	const result = await fetchBuffer(url, ContentType.TEXT);
	const body = result.body.toString('utf8');

	return {
		...result,
		body
	};
}

export default fetchPlaintext;
