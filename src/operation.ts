import Adapter from 'interface/adapter';

abstract class Operation<T> {
	private adapter: Adapter;

	public constructor(adapter: Adapter) {
		this.adapter = adapter;
	}

	public async perform(): Promise<T> {
		try {
			const result = await this.performInternal();

			return result;
		} catch (error) {
			this.logFailure(error);

			throw error;
		}
	}

	protected getAdapter(): Adapter {
		return this.adapter;
	}

	protected async loadAccountUrl(): Promise<string> {
		return Promise.resolve('http://localhost/system/account/anonymous');
	}

	private logFailure(error: Error): void {
		console.error(error);
	}

	protected abstract performInternal(): Promise<T>;
}

export default Operation;
