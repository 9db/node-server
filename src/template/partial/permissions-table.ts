import Template from 'template';
import PermissionNode from 'type/node/permission';
import getNodeParameters from 'utility/get-node-parameters';

interface Input {
	readonly permissions: PermissionNode[];
}

class PermissionsTableTemplate extends Template<Input> {
	protected getHtml(): string {
		const permission_rows_html = this.getPermissionRowsHtml();

		return `
			<table>
				<thead>
					<tr>
						<th>
							Group
						</th>
						<th>
							Permission type
						</th>
					</tr>
				</thead>
				<tbody>
					${permission_rows_html}
				</tbody>
			</table>
		`;
	}

	private getPermissionRowsHtml(): string {
		const permissions = this.getPermissions();

		const permission_rows = permissions.map((permission) => {
			return this.serializePermission(permission);
		});

		return permission_rows.join('\n');
	}

	private serializePermission(permission: PermissionNode): string {
		const group_url = permission.group;
		const parameters = getNodeParameters(group_url);
		const group_id = parameters.id;
		const permission_type = permission.permission_type;

		return `
			<tr>
				<td>
					<a href="${group_url}">${group_id}</a>
				</td>
				<td>
					${permission_type}
				</td>
			</tr>
		`;
	}

	private getPermissions(): PermissionNode[] {
		const input = this.getInput();

		return input.permissions;
	}
}

export default PermissionsTableTemplate;
