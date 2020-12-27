import FieldValue from 'type/field-value';

interface FieldValueTransformer {
	(value: FieldValue, hostname: string): FieldValue;
}

export default FieldValueTransformer;
