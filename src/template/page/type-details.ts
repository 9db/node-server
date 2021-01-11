import getNodeParameters from 'utility/get-node-parameters';
import FieldTableTemplate from 'template/page/type-details/field-table';
import NodeDetailsTemplate from 'template/page/node-details';

class TypeDetailsTemplate extends NodeDetailsTemplate {
	protected getContentHtml(): string {
		const node_content_html = super.getContentHtml();
		const instances_html = this.getInstancesHtml();

		return `
			${node_content_html}

			<section>
				<h3>Instances:</h3>

				${instances_html}
			</section>
		`;
	}

	protected getFieldTableHtml(): string {
		const fields = this.getFields();

		const template = new FieldTableTemplate({
			fields
		});

		return template.render();
	}

	protected getNodeLabel(): string {
		return 'type';
	}

	private getInstancesHtml(): string {
		if (!this.hasInstanceUrls()) {
			return '<em>No instances found.</em>';
		}

		const instance_urls = this.getInstanceUrls();

		const serialized_instances = instance_urls.map((instance_url) => {
			const parameters = getNodeParameters(instance_url);
			const instance_id = parameters.id;

			return `
				<li>
					<a href="${instance_url}">${instance_id}</a>
				</li>
			`;
		});

		const list_html = serialized_instances.join('\n');

		return `
			<ul>
				${list_html}
			</ul>
		`;
	}

	private hasInstanceUrls(): boolean {
		const instance_urls = this.getInstanceUrls();

		return instance_urls.length > 0;
	}

	private getInstanceUrls(): string[] {
		const node = this.getNode();

		return node.instances as string[];
	}
}

export default TypeDetailsTemplate;
