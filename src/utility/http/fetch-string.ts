import fetchBuffer from 'utility/http/fetch-buffer';

async function fetchString(url: string): Promise<string> {
	const buffer = await fetchBuffer(url);

	return buffer.toString('utf8');
}

export default fetchString;
