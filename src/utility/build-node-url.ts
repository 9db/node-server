interface NodeParameters {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
}

function buildNodeUrl(hostname: string, parameters: NodeParameters): string {
	const { namespace_key, type_key, key } = parameters;

	return `${hostname}/${namespace_key}/${type_key}/${key}`;
}

export default buildNodeUrl;
