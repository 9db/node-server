import FieldValue from 'type/field-value';

function unstandardizeUrl(value: FieldValue, hostname: string): FieldValue {
	if (typeof value !== 'string') {
		return value;
	}

	if (value.startsWith('<9dbhost>')) {
		value = value.replace('<9dbhost>', hostname);
	}

	return value;
}

export default unstandardizeUrl;
