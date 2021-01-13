import Route from 'route';
import HtmlHomeRoute from 'route/html/home';
import StaticCssRoute from 'route/static/css';
import HtmlLoginRoute from 'route/html/login';
import HtmlLogoutRoute from 'route/html/logout';
import HtmlNotFoundRoute from 'route/html/not-found';
import JsonNotFoundRoute from 'route/json/not-found';
import HtmlCreateTypeRoute from 'route/html/create-type';
import HtmlTypeDetailsRoute from 'route/html/type-details';
import PlaintextRobotsRoute from 'route/plaintext/robots';
import PlaintextVersionRoute from 'route/plaintext/version';
import HtmlCreateSessionRoute from 'route/html/create-session';
import JsonFetchInstanceRoute from 'route/json/fetch-instance';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';
import HtmlCreateInstanceRoute from 'route/html/create-instance';
import JsonCreateInstanceRoute from 'route/json/create-instance';
import HtmlUpdateInstanceRoute from 'route/html/update-instance';
import HtmlUpdateTypeFormRoute from 'route/html/update-type-form';
import HtmlCreateTypeFormRoute from 'route/html/create-type-form';
import HtmlInstanceDetailsRoute from 'route/html/instance-details';
import HtmlEditInstanceFormRoute from 'route/html/edit-instance-form';
import HtmlCreateInstanceFormRoute from 'route/html/create-instance-form';

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
		new HtmlCreateTypeFormRoute(),
		new HtmlCreateInstanceFormRoute(),
		new HtmlEditInstanceFormRoute(),
		new HtmlCreateSessionRoute(),
		new HtmlUpdateTypeFormRoute(),
		new HtmlCreateTypeRoute(),
		new HtmlCreateInstanceRoute(),
		new HtmlUpdateInstanceRoute(),
		new HtmlTypeDetailsRoute(),
		new HtmlInstanceDetailsRoute(),

		// 404 fallbacks:
		new JsonNotFoundRoute(),
		new HtmlNotFoundRoute(),
		new PlaintextNotFoundRoute()
	];
}

export default buildRoutes;
