import HTTP from 'http';

import HeaderMap from 'http/type/header-map';
import StatusCode from 'http/enum/status-code';

function buildMockResponse(): HTTP.ServerResponse {
	return {
		/* eslint-disable @typescript-eslint/no-empty-function */
		writeHead(_status_code: StatusCode, _headers: HeaderMap): void {},
		end(_data: string | Buffer): void {},
		/* eslint-enable @typescript-eslint/no-empty-function */
	} as HTTP.ServerResponse;
}

export default buildMockResponse;
