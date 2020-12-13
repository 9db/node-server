import Route from 'route';
import HtmlLoginRoute from 'route/html/login';
import HtmlNotFoundRoute from 'route/html/not-found';
import JsonNotFoundRoute from 'route/json/not-found';
import JsonFetchNodeRoute from 'route/json/fetch-node';
import JsonCreateNodeRoute from 'route/json/create-node';
import PlaintextVersionRoute from 'route/plaintext/version';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

function buildRoutes(): Route[] {
	return [
		new PlaintextVersionRoute(),
		new JsonFetchNodeRoute(),
		new JsonCreateNodeRoute(),
		new HtmlLoginRoute(),

		new JsonNotFoundRoute(),
		new HtmlNotFoundRoute(),
		new PlaintextNotFoundRoute()
	];
}

export default buildRoutes;
