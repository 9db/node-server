import Repository from 'repository';

abstract class Operation<T> {
	private repository: Repository;

	public constructor(repository: Repository) {
		this.repository = repository;
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

	protected getRepository(): Repository {
		return this.repository;
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
