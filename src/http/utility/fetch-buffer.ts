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

function fetchBuffer(
	url: string,
	content_type: ContentType
): Promise<ResponseData> {
	return transmit(url, HttpMethod.GET, content_type, Buffer.from(''));
}

export default fetchBuffer;
