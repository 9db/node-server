function standardizeIndentation(html: string): string {
	const original_lines = html.split('\n');
	const indented_lines: string[] = [];

	let indentation = '';

	original_lines.forEach((original_line) => {
		const trimmed_line = original_line.trim();

		if (trimmed_line.length === 0) {
			return;
		}

		if (trimmed_line === '<br>' || trimmed_line === '<hr>') {
			throw new Error('Specify void elements as self-closing');
		}

		const has_open_tag = /^<[a-z]/.test(trimmed_line);
		const has_close_tag = /<\/[^>]+>$/.test(trimmed_line);
		const is_self_closing = /^<[a-z].*\/>$/.test(trimmed_line);

		if (!has_open_tag && has_close_tag && !is_self_closing) {
			indentation = indentation.slice(0, -1);
		}

		const indented_line = `${indentation}${trimmed_line}`;

		indented_lines.push(indented_line);

		if (has_open_tag && !has_close_tag && !is_self_closing) {
			indentation += '\t';
		}
	});

	return indented_lines.join('\n');
}

export default standardizeIndentation;
