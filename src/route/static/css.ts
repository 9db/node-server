import Route from 'route';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import StaticCssEndpoint from 'endpoint/static/css';

class StaticCssRoute extends Route {
	public constructor() {
		super(ContentType.CSS, HttpMethod.GET, '/site.css', StaticCssEndpoint);
	}
}

export default StaticCssRoute;
