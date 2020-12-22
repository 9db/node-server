interface NodeParameters {
	readonly type_key: string;
	readonly key: string;
}

function buildNodeUrl(hostname: string, parameters: NodeParameters): string {
	const { type_key, key } = parameters;

	return `${hostname}/${type_key}/${key}`;
}

export default buildNodeUrl;
