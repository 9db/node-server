import HTTP from 'http';

import HeaderMap from 'http/type/header-map';
import StatusCode from 'http/enum/status-code';

function buildMockResponse(): HTTP.ServerResponse {
	return {
		writeHead(status_code: StatusCode, headers: HeaderMap): void {},
		end(data: string | Buffer): void {},
	} as HTTP.ServerResponse;
}

export default buildMockResponse;
