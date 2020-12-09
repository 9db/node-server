import HeaderMap from 'http/type/header-map';
import StatusCode from 'http/enum/status-code';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';
import postBuffer from 'http/utility/post-buffer';

interface ResponseData {
	body: JsonObject;
	headers: HeaderMap;
	status_code: StatusCode;
}

async function postJson(url: string, data: JsonObject): Promise<ResponseData> {
	const serialized_data = JSON.stringify(data);
	const buffer = Buffer.from(serialized_data);
	const result = await postBuffer(url, ContentType.JSON, buffer);
	const string_body = result.body.toString('utf8');
	const body = JSON.parse(string_body);

	return {
		...result,
		body,
	};
}

export default postJson;
