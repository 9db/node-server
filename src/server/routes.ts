import JsonNotFoundRoute from 'route/json/not-found';
import PlaintextVersionRoute from 'route/plaintext/version';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

const ROUTES = [
	new PlaintextVersionRoute(),
	new PlaintextNotFoundRoute(),
	new JsonNotFoundRoute(),
];

export default ROUTES;
