import Route from 'route';
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
		new PlaintextNotFoundRoute(),
		new JsonNotFoundRoute(),
	];
}

export default buildRoutes;
