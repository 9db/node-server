import SystemFieldKey from 'system/enum/field-key';

const SYSTEM_FIELD_KEYS = Object.values(SystemFieldKey) as string[];

function isSystemFieldKey(field_key: string): boolean {
	return SYSTEM_FIELD_KEYS.includes(field_key);
}

export default isSystemFieldKey;
