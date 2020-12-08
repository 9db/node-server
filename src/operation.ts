abstract class Operation<T> {
	public async perform(): Promise<T> {
		try {
			const result = await this.performInternal();

			return result;
		} catch (error) {
			this.logFailure(error);

			throw error;
		}
	}

	private logFailure(error: Error): void {
		console.error(error);
	}

	protected abstract performInternal(): Promise<T>;
}

export default Operation;
