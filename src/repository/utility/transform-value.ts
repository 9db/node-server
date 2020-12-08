import FieldValue from 'type/field-value';
import PrimitiveTransformer from 'repository/interface/primitive-transformer';

function transformValue(
	value: FieldValue,
	hostname: string,
	transformer: PrimitiveTransformer
): FieldValue {
	if (Array.isArray(value)) {
		return value.map((value) => {
			return transformer(value, hostname);
		});
	}

	return transformer(value, hostname);
}

export default transformValue;
