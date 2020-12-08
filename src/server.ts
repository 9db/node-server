import HTTP from 'http';

import Route from 'route';
import Adapter from 'interface/adapter';
import closeServer from 'http/utility/close-server';
import buildRoutes from 'server/utility/build-routes';
import MemoryAdapter from 'adapter/memory';

interface ServerConfig {
	readonly port: number;
	readonly adapter: Adapter;
	readonly hostname: string;
}

function buildDefaultConfig(): ServerConfig {
	return {
		port: 9999,
		adapter: new MemoryAdapter(),
		hostname: 'localhost',
	};
}

class Server {
	private port: number;
	private adapter: Adapter;
	private hostname: string;
	private server: HTTP.Server;
	private routes: Route[];

	public constructor(partial_config?: Partial<ServerConfig>) {
		const config: ServerConfig = {
			...buildDefaultConfig(),
			...partial_config,
		};

		this.port = config.port;
		this.adapter = config.adapter;
		this.hostname = config.hostname;
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

	public getAdapter(): Adapter {
		return this.adapter;
	}

	public getHostname(): string {
		return this.hostname;
	}

	private handleRequest(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse
	): void {
		const route = this.findRouteForRequest(request);
		const adapter = this.getAdapter();

		route.serve(request, response, adapter);
	}

	private findRouteForRequest(request: HTTP.IncomingMessage): Route {
		const routes = this.getRoutes();

		const route = routes.find((route) => {
			return route.accepts(request);
		});

		if (route === undefined) {
			throw new Error(`No route found for request: ${request.url}`);
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
