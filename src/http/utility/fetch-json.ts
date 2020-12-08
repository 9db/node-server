import HeaderMap from 'http/type/header-map';
import StatusCode from 'http/enum/status-code';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';
import fetchBuffer from 'http/utility/fetch-buffer';

interface ResponseData {
	body: JsonObject;
	headers: HeaderMap;
	status_code: StatusCode;
}

async function fetchJson(url: string): Promise<ResponseData> {
	const result = await fetchBuffer(url, ContentType.JSON);
	const string_body = result.body.toString('utf8');
	const body = JSON.parse(string_body);

	return {
		...result,
		body,
	};
}

export default fetchJson;
