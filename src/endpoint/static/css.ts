import ContentType from 'http/enum/content-type';
import StaticEndpoint from 'endpoint/static';

class StaticCssEndpoint extends StaticEndpoint {
	protected process(): Promise<Buffer> {
		const result = Buffer.from(`
			menu {
				margin: 0;
				float: right;
			}

			hr {
				clear: both;
			}
		`);

		return Promise.resolve(result);
	}

	protected getResponseContentType(): ContentType {
		return ContentType.CSS;
	}
}

export default StaticCssEndpoint;
