import HTTP from 'http';

import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';

function getSuccessfulStatusCode(request: HTTP.IncomingMessage): StatusCode {
	const method = request.method;

	if (method === HttpMethod.POST) {
		return StatusCode.CREATED;
	} else {
		return StatusCode.SUCCESS;
	}
}

export default getSuccessfulStatusCode;
