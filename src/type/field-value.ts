export type PrimitiveValue = string | number | boolean | null;
export type ListValue = PrimitiveValue[];

type FieldValue = PrimitiveValue | ListValue;

export default FieldValue;
