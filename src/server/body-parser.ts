import HTTP from 'http';

import JsonObject from 'http/type/json-object';

abstract class BodyParser {
	private request: HTTP.IncomingMessage;

	public constructor(request: HTTP.IncomingMessage) {
		this.request = request;
	}

	public async parse(): Promise<JsonObject> {
		const buffer = await this.readBuffer();

		return this.transformBuffer(buffer);
	}

	private readBuffer(): Promise<Buffer> {
		const request = this.getRequest();
		const chunks: Buffer[] = [];

		request.on('data', (data) => {
			chunks.push(data);
		});

		return new Promise((resolve, reject) => {
			request.on('end', () => {
				const body = Buffer.concat(chunks);

				resolve(body);
			});

			request.on('error', reject);
		});
	}

	private getRequest(): HTTP.IncomingMessage {
		return this.request;
	}

	protected abstract transformBuffer(buffer: Buffer): JsonObject;
}

export default BodyParser;
