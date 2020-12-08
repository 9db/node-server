import { PrimitiveValue } from 'type/field-value';

interface PrimitiveTransformer {
	(value: PrimitiveValue, hostname: string): PrimitiveValue;
}

export default PrimitiveTransformer;
