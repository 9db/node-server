function getListInnerType(type_id: string): string | null {
	const match = type_id.match(/^(.*)-(list|set)$/);

	if (match === null) {
		return null;
	}

	return match[1] || null;
}

export default getListInnerType;
