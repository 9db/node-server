import ContentType from 'http/enum/content-type';
import fetchBuffer from 'http/utility/fetch-buffer';
import ResponseData from 'http/type/response-data';

async function fetchPlaintext(url: string): Promise<ResponseData> {
	const result = await fetchBuffer(url, ContentType.TEXT);
	const body = result.body.toString('utf8');

	return {
		...result,
		body,
	};
}

export default fetchPlaintext;
