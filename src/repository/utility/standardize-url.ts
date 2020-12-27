import FieldValue from 'type/field-value';

function standardizeUrl(value: FieldValue, hostname: string): FieldValue {
	if (typeof value !== 'string') {
		return value;
	}

	if (value.startsWith(hostname)) {
		value = value.replace(hostname, '<9dbhost>');
	}

	return value;
}

export default standardizeUrl;
