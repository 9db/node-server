enum SystemId {
	ACCOUNT_TYPE = 'account',
	CHANGE_TYPE = 'change',
	GENERIC_TYPE = 'type',
	GROUP_TYPE = 'group',
	PERMISSION_TYPE = 'permission',
	SESSION_TYPE = 'session',
	STRING_TYPE = 'string',

	ACCOUNT_LIST_TYPE = 'account-list',

	SYSTEM_ACCOUNT = 'system',
	ANONYMOUS_ACCOUNT = 'anonymous',

	ADMIN_CREATE_PERMISSION = 'admin-create',
	EVERYONE_READ_PERMISSION = 'everyone-read',

	ADMIN_GROUP = 'admin',
	EVERYONE_GROUP = 'everyone'
}

export default SystemId;
