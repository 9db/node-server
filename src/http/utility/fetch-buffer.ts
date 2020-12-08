import HTTP from 'http';

import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ResponseData from 'http/type/response-data';

function fetchBuffer(
	url: string,
	content_type: ContentType
): Promise<ResponseData> {
	const headers = {
		[HttpHeader.ACCEPT]: content_type,
	};

	const options = {
		headers,
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
					status_code,
				});
			});
		});

		request.on('error', reject);
		request.end();
	});
}

export default fetchBuffer;
