export type PrimitiveValue = string | number | boolean | null;
export type ListValue = string[] | number[] | boolean[];

type FieldValue = PrimitiveValue | ListValue;

export default FieldValue;
