class KeyGenerator {
	public static id(): string {
		return Math.random().toString(16).slice(2);
	}
}

export default KeyGenerator;
