interface NodeParameters {
	readonly id: string;
	readonly type_id: string;
}

function buildNodeUrl(hostname: string, parameters: NodeParameters): string {
	const { type_id, id } = parameters;

	return `${hostname}/${type_id}/${id}`;
}

export default buildNodeUrl;
