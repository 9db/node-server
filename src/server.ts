import Adapter from 'interface/adapter';
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

	public constructor(partial_config?: Partial<ServerConfig>) {
		const config: ServerConfig = {
			...buildDefaultConfig(),
			...partial_config,
		};

		this.port = config.port;
		this.adapter = config.adapter;
		this.hostname = config.hostname;
	}

	public start(): void {}

	public stop(): Promise<void> {
		return Promise.resolve();
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
}

export default Server;
