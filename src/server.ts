import HTTP from 'http';

import Adapter from 'interface/adapter';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import EndpointConstructor from 'interface/endpoint-constructor';
import VersionPlaintextEndpoint from 'endpoint/plaintext/version';
import NotFoundPlaintextEndpoint from 'endpoint/plaintext/not-found';

const ENDPOINT_CONSTRUCTORS: EndpointConstructor[] = [
	VersionPlaintextEndpoint,
	NotFoundPlaintextEndpoint,
];

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

	public constructor(partial_config?: Partial<ServerConfig>) {
		const config: ServerConfig = {
			...buildDefaultConfig(),
			...partial_config,
		};

		this.port = config.port;
		this.adapter = config.adapter;
		this.hostname = config.hostname;

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
		const Endpoint = this.determineEndpointConstructorForRequest(request);
		const endpoint = new Endpoint(request, response);

		endpoint.serve();
	}

	private determineEndpointConstructorForRequest(
		request: HTTP.IncomingMessage
	): EndpointConstructor {
		const Constructor = ENDPOINT_CONSTRUCTORS.find((endpoint_constructor) => {
			return endpoint_constructor.accepts(request);
		});

		if (Constructor === undefined) {
			return NotFoundPlaintextEndpoint;
		}

		return Constructor;
	}

	private getServer(): HTTP.Server {
		return this.server;
	}
}

export default Server;
