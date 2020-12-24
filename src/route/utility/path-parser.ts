interface ParsedPath {
	readonly regex: RegExp;
	readonly parameter_keys: string[];
}

class PathParser {
	private path: string;

	public constructor(path: string) {
		this.path = path;
	}

	public parse(): ParsedPath {
		const path = this.getPathWithoutLeadingSlash();
		const path_parts = path.split('/');
		const parameter_keys: string[] = [];

		const regex_parts = path_parts.map((path_part) => {
			if (!path_part.startsWith(':')) {
				return path_part;
			}

			const parameter_key = path_part.slice(1);

			parameter_keys.push(parameter_key);

			return '([^\\/]+)';
		});

		const querystring = '(\\?[^\/]+)?';

		const regex_string = '^/' + regex_parts.join('/') + querystring + '$';
		const regex = new RegExp(regex_string);

		return {
			regex,
			parameter_keys
		};
	}

	private getPathWithoutLeadingSlash(): string {
		return this.path.slice(1);
	}
}

export default PathParser;
