import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlEditInstanceFormEndpoint from 'endpoint/html/edit-instance-form';

class HtmlEditInstanceFormRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/edit-instance', HtmlEditInstanceFormEndpoint);
	}
}

export default HtmlEditInstanceFormRoute;
