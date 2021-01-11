import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {}

class HomePageTemplate extends PageTemplate<Input> {
	protected getContentTitle(): string {
		return '9DB dev server';
	}

	protected getBreadcrumbs(): Breadcrumb[] {
		return [
			{
				label: 'Home'
			}
		];
	}

	protected getContentHtml(): string {
		return `
			<section>
				<h3>Overview</h3>

				<p>
					This is a development server that I'm using for testing out my new 9DB
					database and API specification. You can view the code that powers this
					site <a href="https://github.com/9db/node-server">here</a>.
				</p>
			</section>

			<section>
				<h3>What is 9DB?</h3>

				<p>
					9DB is a set of guidelines that make it easier to link between bits
					of related data on the internet. It draws from a lot of prior art
					regarding linked data and semantic websites, such as:
				</p>

				<ul>
					<li>
						<a href="https://json-ld.org">JSON-LD</a>
					</li>
					<li>
						<a href="https://www.w3.org/2001/sw/wiki/RDF">Resource Description Framework</a>
					</li>
					<li>
						<a href="https://schema.org">schema.org</a>
					</li>
					<li>
						<a href="https://www.wikidata.org">Wikidata</a>
					</li>
				</ul>

				<p>
					... and so on. Suffice it to say that these attempts, while noble,
					have never really made significant headway into the hearts and minds
					of your average web user. On the other hand, the early foundations of
					the web, like hyperlinks, discrete pages and sites, and markup, have
					been adopted and used much more widely. The goal should be to enable
					the same kind of adoption of linked data for the average user.
				</p>

				<p>
					To that end, 9DB is not a tool for developers. Its first goal is to
					solve real problems for everyday people, the same way that email,
					websites, and filesystems do. The only way for linked data to become
					widely adopted is for it to make people's lives easier, not harder.
				</p>
			</section>

			<section>
				<h3>Nodes and types</h3>

				<p>
					In 9DB, everything is a <strong>node</strong> &mdash; a small bundle
					of related information that describes something. These can be abstract
					things, like user sessions, or concrete things, like packages in the
					mail.
				</p>

				<p>
					Each <strong>node</strong> points to an abstract <strong>type</strong>
					node that defines the attributes that are common to all the instances
					of that type. So you could have two nodes representing individual
					packages in the mail, and they would both point to a Package type node
					that defines the attributes that all packages have in common.
				</p>

				<p>
					Even type nodes share a common type: the <strong>>type</strong>
					generic type. You can view all of the sub-types that inherit from
					that generic type <a href="/type">here</a>.
			</section>

			<section>
				<h3>Open issues</h3>

				<p>
					You can view a list of the ongoing issues that I'm tackling as part of
					this work <a href="/issue">here</a>.
				</p>
			</section>
		`;
	}
}

export default HomePageTemplate;
