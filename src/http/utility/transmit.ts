import HTTP from 'http';

import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';

interface ResponseData {
	body: Buffer;
	headers: HeaderMap;
	status_code: StatusCode;
}

function transmit(
	url: string,
	method: HttpMethod,
	content_type: ContentType,
	data: Buffer
): Promise<ResponseData> {
	const headers = {
		[HttpHeader.ACCEPT]: content_type
	};

	const options = {
		method,
		headers
	};

	const request = HTTP.request(url, options);

	return new Promise((resolve, reject) => {
		request.on('response', (response) => {
			const headers = response.headers as HeaderMap;
			const status_code = response.statusCode as StatusCode;
			const chunks: Buffer[] = [];

			response.on('data', (data) => {
				chunks.push(data);
			});

			response.on('end', () => {
				const body = Buffer.concat(chunks);

				resolve({
					body,
					headers,
					status_code
				});
			});
		});

		request.on('error', reject);
		request.end(data);
	});
}

export default transmit;
