import Route from 'route';
import Adapter from 'interface/adapter';
import JsonNotFoundRoute from 'route/json/not-found';
import JsonFetchNodeRoute from 'route/json/fetch-node';
import PlaintextVersionRoute from 'route/plaintext/version';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

function buildRoutes(adapter: Adapter): Route[] {
	return [
		new PlaintextVersionRoute(adapter),
		new JsonFetchNodeRoute(adapter),
		new PlaintextNotFoundRoute(adapter),
		new JsonNotFoundRoute(adapter)
	];
}

export default buildRoutes;
