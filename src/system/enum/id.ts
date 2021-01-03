enum SystemId {
	ACCOUNT_TYPE = 'account',
	CHANGE_TYPE = 'change',
	GENERIC_TYPE = 'type',
	GROUP_TYPE = 'group',
	PERMISSION_TYPE = 'permission',
	SESSION_TYPE = 'session',
	STRING_TYPE = 'string',

	CHANGE_LIST_TYPE = 'change-list',

	ACCOUNT_SET_TYPE = 'account-set',
	PERMISSION_SET_TYPE = 'permission-set',
	TYPE_SET_TYPE = 'type-set',

	SYSTEM_ACCOUNT = 'system',
	ANONYMOUS_ACCOUNT = 'anonymous',

	PUBLIC_READ_PERMISSION = 'public-read',

	ADMIN_GROUP = 'admin',
	EVERYONE_GROUP = 'everyone'
}

export default SystemId;
