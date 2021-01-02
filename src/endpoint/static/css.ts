import ContentType from 'http/enum/content-type';
import StaticEndpoint from 'endpoint/static';

class StaticCssEndpoint extends StaticEndpoint {
	protected process(): Promise<Buffer> {
		const result = Buffer.from(`
			body {
				background: #222;
				color: #FFF;
			}

			a {
				color: #0FF;
			}

			a:visited {
				color: #09F;
			}

			menu {
				margin: 0;
				float: right;
			}

			main {
				min-height: 85vh;
			}

			hr {
				clear: both;
			}

			fieldset {
				border: none;
				border-bottom: 1px solid #CCC;
				margin-bottom: 16px;
			}

			table {
				caption-side: bottom;
			}

			caption {
				text-align: left;
				margin-top: 8px;
			}

			th {
				text-align: left;
			}

			label {
				display: block;
				font-weight: bold;
				margin-bottom: 4px;
			}
		`);

		return Promise.resolve(result);
	}

	protected getResponseContentType(): ContentType {
		return ContentType.CSS;
	}
}

export default StaticCssEndpoint;
