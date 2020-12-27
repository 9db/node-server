import HTTP from 'http';

import Route from 'route';
import Adapter from 'interface/adapter';
import Repository from 'repository';
import closeServer from 'http/utility/close-server';
import buildRoutes from 'server/utility/build-routes';
import MemoryAdapter from 'adapter/memory';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

interface ServerConfig {
	readonly port: number;
	readonly adapter: Adapter;
	readonly hostname: string;
}

function buildConfig(partial_config?: Partial<ServerConfig>): ServerConfig {
	let port = 9999;

	if (partial_config !== undefined && partial_config.port !== undefined) {
		port = partial_config.port;
	}

	const hostname = `http://localhost:${port}`;
	const adapter = new MemoryAdapter();

	return {
		port,
		adapter,
		hostname,
		...partial_config
	};
}

class Server {
	private port: number;
	private adapter: Adapter;
	private hostname: string;
	private repository: Repository;
	private server: HTTP.Server;
	private routes: Route[];

	public constructor(partial_config?: Partial<ServerConfig>) {
		const config = buildConfig(partial_config);

		this.port = config.port;
		this.hostname = config.hostname;
		this.adapter = config.adapter;
		this.repository = new Repository(config.hostname, config.adapter);
		this.routes = buildRoutes();

		this.server = HTTP.createServer((request, response) => {
			this.handleRequest(request, response);
		});
	}

	public start(): void {
		const port = this.getPort();
		const server = this.getServer();

		server.listen(port);
	}

	public stop(): Promise<void> {
		const server = this.getServer();

		return closeServer(server);
	}

	public getPort(): number {
		return this.port;
	}

	public getRepository(): Repository {
		return this.repository;
	}

	public getHostname(): string {
		return this.hostname;
	}

	public getAdapter(): Adapter {
		return this.adapter;
	}

	private handleRequest(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse
	): void {
		const route = this.findRouteForRequest(request);
		const repository = this.getRepository();

		route.serve(request, response, repository);
	}

	private findRouteForRequest(request: HTTP.IncomingMessage): Route {
		const routes = this.getRoutes();

		const route = routes.find((route) => {
			return route.accepts(request);
		});

		if (route === undefined) {
			return new PlaintextNotFoundRoute();
		}

		return route;
	}

	private getServer(): HTTP.Server {
		return this.server;
	}

	private getRoutes(): Route[] {
		return this.routes;
	}
}

export default Server;
