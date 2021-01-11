import Route from 'route';
import HtmlHomeRoute from 'route/html/home';
import StaticCssRoute from 'route/static/css';
import HtmlLoginRoute from 'route/html/login';
import HtmlLogoutRoute from 'route/html/logout';
import HtmlTypeFormRoute from 'route/html/type-form';
import HtmlNotFoundRoute from 'route/html/not-found';
import JsonNotFoundRoute from 'route/json/not-found';
import HtmlCreateTypeRoute from 'route/html/create-type';
import HtmlTypeDetailsRoute from 'route/html/type-details';
import PlaintextRobotsRoute from 'route/plaintext/robots';
import HtmlInstanceFormRoute from 'route/html/instance-form';
import PlaintextVersionRoute from 'route/plaintext/version';
import HtmlCreateSessionRoute from 'route/html/create-session';
import JsonFetchInstanceRoute from 'route/json/fetch-instance';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';
import HtmlCreateInstanceRoute from 'route/html/create-instance';
import JsonCreateInstanceRoute from 'route/json/create-instance';
import HtmlUpdateTypeFormRoute from 'route/html/update-type-form';
import HtmlInstanceDetailsRoute from 'route/html/instance-details';

function buildRoutes(): Route[] {
	return [
		// Static responses:
		new PlaintextRobotsRoute(),
		new PlaintextVersionRoute(),
		new StaticCssRoute(),

		// JSON:
		new JsonFetchInstanceRoute(),
		new JsonCreateInstanceRoute(),

		// HTML:
		new HtmlHomeRoute(),
		new HtmlLoginRoute(),
		new HtmlLogoutRoute(),
		new HtmlTypeFormRoute(),
		new HtmlInstanceFormRoute(),
		new HtmlCreateSessionRoute(),
		new HtmlUpdateTypeFormRoute(),
		new HtmlCreateTypeRoute(),
		new HtmlCreateInstanceRoute(),
		new HtmlTypeDetailsRoute(),
		new HtmlInstanceDetailsRoute(),

		// 404 fallbacks:
		new JsonNotFoundRoute(),
		new HtmlNotFoundRoute(),
		new PlaintextNotFoundRoute()
	];
}

export default buildRoutes;
