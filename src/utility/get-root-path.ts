function getRootPath(): string {
	const current_path = __dirname;
	const project_name = 'node-server';
	const index = current_path.indexOf(project_name);

	if (index === -1) {
		throw new Error(`Unable to parse process directory: ${current_path}`);
	}

	const prefix = current_path.slice(0, index);

	return `${prefix}/${project_name}`;
}

export default getRootPath;
