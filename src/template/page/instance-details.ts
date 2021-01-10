import FieldTableTemplate from 'template/page/instance-details/field-table';
import NodeDetailsTemplate from 'template/page/node-details';

class InstanceDetailsTemplate extends NodeDetailsTemplate {
	protected getFieldTableHtml(): string {
		const fields = this.getFields();

		const template = new FieldTableTemplate({
			fields
		});

		return template.render();
	}
}

export default InstanceDetailsTemplate;
