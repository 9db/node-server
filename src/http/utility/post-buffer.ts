import transmit from 'http/utility/transmit';
import HeaderMap from 'http/type/header-map';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';

interface ResponseData {
	body: Buffer;
	headers: HeaderMap;
	status_code: StatusCode;
}

function postBuffer(
	url: string,
	content_type: ContentType,
	data: Buffer
): Promise<ResponseData> {
	return transmit(url, HttpMethod.POST, content_type, data);
}

export default postBuffer;
