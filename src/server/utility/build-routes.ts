import Route from 'route';
import HtmlHomeRoute from 'route/html/home';
import StaticCssRoute from 'route/static/css';
import HtmlLoginRoute from 'route/html/login';
import HtmlLogoutRoute from 'route/html/logout';
import HtmlTypeFormRoute from 'route/html/type-form';
import HtmlNotFoundRoute from 'route/html/not-found';
import JsonNotFoundRoute from 'route/json/not-found';
import JsonFetchNodeRoute from 'route/json/fetch-node';
import JsonCreateNodeRoute from 'route/json/create-node';
import HtmlNodeDetailsRoute from 'route/html/node-details';
import HtmlTypeDetailsRoute from 'route/html/type-details';
import PlaintextVersionRoute from 'route/plaintext/version';
import HtmlCreateSessionRoute from 'route/html/create-session';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

function buildRoutes(): Route[] {
	return [
		// Static responses:
		new PlaintextVersionRoute(),
		new StaticCssRoute(),

		// JSON:
		new JsonFetchNodeRoute(),
		new JsonCreateNodeRoute(),

		// HTML:
		new HtmlHomeRoute(),
		new HtmlLoginRoute(),
		new HtmlLogoutRoute(),
		new HtmlTypeFormRoute(),
		new HtmlNodeDetailsRoute(),
		new HtmlTypeDetailsRoute(),
		new HtmlCreateSessionRoute(),

		// 404 fallbacks:
		new JsonNotFoundRoute(),
		new HtmlNotFoundRoute(),
		new PlaintextNotFoundRoute()
	];
}

export default buildRoutes;
