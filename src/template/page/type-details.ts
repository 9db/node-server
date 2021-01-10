import FieldTableTemplate from 'template/page/type-details/field-table';
import NodeDetailsTemplate from 'template/page/node-details';

class TypeDetailsTemplate extends NodeDetailsTemplate {
	protected getFieldTableHtml(): string {
		const fields = this.getFields();

		const template = new FieldTableTemplate({
			fields
		});

		return template.render();
	}
}

export default TypeDetailsTemplate;
