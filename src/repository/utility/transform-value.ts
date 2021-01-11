import FieldValueTransformer from 'repository/interface/field-value-transformer';
import FieldValue, { PrimitiveValue, ListValue } from 'type/field-value';

function transformValue(
	value: FieldValue,
	hostname: string,
	transformer: FieldValueTransformer
): FieldValue {
	if (Array.isArray(value)) {
		const original_list = value as PrimitiveValue[];
		const transformed_list = original_list.map((list_value) => {
			return transformer(list_value, hostname);
		});

		return transformed_list as ListValue;
	}

	return transformer(value, hostname);
}

export default transformValue;
