import HeaderMap from 'http/type/header-map';
import StatusCode from 'http/enum/status-code';

interface ResponseData {
	body: string | Buffer;
	headers: HeaderMap;
	status_code: StatusCode;
}

export default ResponseData;
