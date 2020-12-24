import SystemId from 'system/enum/id';
import Repository from 'repository';
import NodeFactory from 'factory/node';
import MemoryAdapter from 'adapter/memory';

describe('Repository', () => {
	const hostname = 'https://9db.org';
	const creator = `${hostname}/account/iluvatar`;

	let adapter!: MemoryAdapter;
	let repository!: Repository;

	beforeEach(() => {
		adapter = new MemoryAdapter();
		repository = new Repository(hostname, adapter);
	});

	describe('fetchNode()', () => {
		it('returns the expected node', async () => {
			const expected_node = NodeFactory.create();

			await repository.storeNode(expected_node);

			const actual_node = await repository.fetchNode(
				expected_node.type_id,
				expected_node.id
			);

			expect(actual_node).toStrictEqual(expected_node);
		});

		describe('when node does not exist in cache', () => {
			it('returns undefined', async () => {
				const node = await repository.fetchNode('nonexistent', 'node');

				expect(node).toStrictEqual(undefined);
			});
		});

		describe('when node contains standardized hostname references', () => {
			it('reinstates the original hostname before returning the node', async () => {
				const expected_node = NodeFactory.create({
					some_url: '<9dbhost>/foo/bar/baz'
				});

				const node_key = `${expected_node.type_id}/${expected_node.id}`;

				await adapter.storeNode(node_key, expected_node);

				const actual_node = await repository.fetchNode(
					expected_node.type_id,
					expected_node.id
				);

				expect(actual_node).toStrictEqual({
					...expected_node,
					some_url: `${hostname}/foo/bar/baz`
				});
			});
		});

		describe('when a system node is requested', () => {
			it('returns the expected system node', async () => {
				const node = await repository.fetchNode(
					SystemId.GENERIC_TYPE,
					SystemId.GENERIC_TYPE
				);

				expect(node).toStrictEqual({
					id: SystemId.GENERIC_TYPE,
					type_id: SystemId.GENERIC_TYPE,
					creator: `${hostname}/account/system`,
					created_at: 0,
					updated_at: 0,
					changes: []
				});
			});
		});
	});

	describe('storeNode()', () => {
		it('stores the node in the cache', async () => {
			const expected_node = NodeFactory.create();

			await repository.storeNode(expected_node);

			const actual_node = await repository.fetchNode(
				expected_node.type_id,
				expected_node.id
			);

			expect(actual_node).toStrictEqual(expected_node);
		});

		it('replaces explicit hostname references with placeholders', async () => {
			const expected_node = NodeFactory.create({
				creator,
				some_url: `${hostname}/foo/bar/baz`,
				url_list: [`${hostname}/bam`, `${hostname}/wat`]
			});

			await repository.storeNode(expected_node);

			const node_key = `${expected_node.type_id}/${expected_node.id}`;
			const actual_node = await adapter.fetchNode(node_key);

			expect(actual_node).toStrictEqual({
				...expected_node,
				creator: '<9dbhost>/account/iluvatar',
				some_url: '<9dbhost>/foo/bar/baz',
				url_list: ['<9dbhost>/bam', '<9dbhost>/wat']
			});
		});
	});

	describe('setField()', () => {
		it('updates the persisted node to include the new field', async () => {
			const node = NodeFactory.create();

			await repository.storeNode(node);

			await repository.setField(node.type_id, node.id, 'wizard', 'gandalf');

			const persisted_node = await repository.fetchNode(node.type_id, node.id);

			expect(persisted_node).toStrictEqual({
				...node,
				wizard: 'gandalf'
			});
		});

		it('returns the new node', async () => {
			const node = NodeFactory.create();

			await repository.storeNode(node);

			const result = await repository.setField(
				node.type_id,
				node.id,
				'wizard',
				'gandalf'
			);

			expect(result).toStrictEqual({
				...node,
				wizard: 'gandalf'
			});
		});

		it('does not destructively modify the input node', async () => {
			const node = NodeFactory.create();
			const original_node = { ...node };

			await repository.storeNode(node);

			await repository.setField(node.type_id, node.id, 'wizard', 'gandalf');

			expect(node).toStrictEqual(original_node);
		});

		it('replaces explicit hostname references with placeholder', async () => {
			const node = NodeFactory.create({
				creator
			});

			await repository.storeNode(node);

			await repository.setField(
				node.type_id,
				node.id,
				'wizard_url',
				`${hostname}/gandalf`
			);

			const node_key = `${node.type_id}/${node.id}`;
			const persisted_node = await adapter.fetchNode(node_key);

			expect(persisted_node).toStrictEqual({
				...node,
				creator: '<9dbhost>/account/iluvatar',
				wizard_url: '<9dbhost>/gandalf'
			});
		});
	});

	describe('addValueToSet()', () => {
		describe('when field does not exist on node', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create();

				await repository.storeNode(node);

				try {
					await repository.addValueToSet(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Unable to find field for key: wizards'
					);
				}
			});
		});

		describe('when field exists but is not an array', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create({
					wizards: 'apply inside'
				});

				await repository.storeNode(node);

				try {
					await repository.addValueToSet(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Field key wizards did not point to an array'
					);
				}
			});
		});

		describe('when set already includes specified value', () => {
			it('does not modify the node in the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf']
				});

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.type_id,
					node.id
				);

				expect(persisted_node).toStrictEqual(node);
			});

			it('returns the same node', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf']
				});

				await repository.storeNode(node);

				const result = await repository.addValueToSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual(node);
			});
		});

		describe('when set does not yet include specified value', () => {
			it('stores the updated node to the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.type_id,
					node.id
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf']
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				await repository.storeNode(node);

				const result = await repository.addValueToSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf']
				});
			});

			it('does not destructively modify the input node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
			});

			it('replaces explicit hostname references with placeholder', async () => {
				const node = NodeFactory.create({
					creator,
					urls: []
				});

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.type_id,
					node.id,
					'urls',
					`${hostname}/gandalf`
				);

				const node_key = `${node.type_id}/${node.id}`;
				const persisted_node = await adapter.fetchNode(node_key);

				expect(persisted_node).toStrictEqual({
					...node,
					creator: '<9dbhost>/account/iluvatar',
					urls: ['<9dbhost>/gandalf']
				});
			});
		});
	});

	describe('removeValueFromSet()', () => {
		describe('when field does not exist on node', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create();

				await repository.storeNode(node);

				try {
					await repository.removeValueFromSet(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Unable to find field for key: wizards'
					);
				}
			});
		});

		describe('when field exists but is not an array', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create({
					wizards: 'apply inside'
				});

				await repository.storeNode(node);

				try {
					await repository.removeValueFromSet(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Field key wizards did not point to an array'
					);
				}
			});
		});

		describe('when set does not yet include specified value', () => {
			it('does not modify the node in the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				await repository.storeNode(node);
				await repository.removeValueFromSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.type_id,
					node.id
				);

				expect(persisted_node).toStrictEqual(node);
			});

			it('returns the same node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				await repository.storeNode(node);

				const result = await repository.removeValueFromSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual(node);
			});
		});

		describe('when set includes specified value', () => {
			it('stores the updated node to the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman', 'gandalf']
				});

				await repository.storeNode(node);
				await repository.removeValueFromSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.type_id,
					node.id
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman']
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman', 'gandalf']
				});

				await repository.storeNode(node);

				const result = await repository.removeValueFromSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman']
				});
			});

			it('does not destructively modify the input node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman', 'gandalf']
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.removeValueFromSet(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
			});
		});
	});

	describe('addValueToList()', () => {
		describe('when field does not exist on node', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create();

				await repository.storeNode(node);

				try {
					await repository.addValueToList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Unable to find field for key: wizards'
					);
				}
			});
		});

		describe('when field exists but is not an array', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create({
					wizards: 'apply inside'
				});

				await repository.storeNode(node);

				try {
					await repository.addValueToList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Field key wizards did not point to an array'
					);
				}
			});
		});

		describe('when field exists and is an array', () => {
			it('stores the updated node to the cache', async () => {
				const node = NodeFactory.create({
					creator,
					wizards: ['saruman']
				});

				await repository.storeNode(node);
				await repository.addValueToList(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.type_id,
					node.id
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf']
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				await repository.storeNode(node);

				const result = await repository.addValueToList(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf']
				});
			});

			it('does not destructively modify the input node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman']
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.addValueToList(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
			});

			it('replaces explicit hostname with placeholder', async () => {
				const node = NodeFactory.create({
					creator,
					wizard_urls: []
				});

				await repository.storeNode(node);
				await repository.addValueToList(
					node.type_id,
					node.id,
					'wizard_urls',
					`${hostname}/gandalf`
				);

				const node_key = `${node.type_id}/${node.id}`;
				const persisted_node = await adapter.fetchNode(node_key);

				expect(persisted_node).toStrictEqual({
					...node,
					creator: '<9dbhost>/account/iluvatar',
					wizard_urls: ['<9dbhost>/gandalf']
				});
			});

			describe('when position argument is zero', () => {
				it('places element at first position in the list', async () => {
					const node = NodeFactory.create({
						wizards: ['saruman']
					});

					await repository.storeNode(node);

					const result = await repository.addValueToList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf',
						0
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['gandalf', 'saruman']
					});
				});
			});

			describe('when position argument is mid-way through the list', () => {
				it('places element at expected position in the list', async () => {
					const node = NodeFactory.create({
						wizards: ['saruman', 'radagast', 'alatar']
					});

					await repository.storeNode(node);

					const result = await repository.addValueToList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf',
						2
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['saruman', 'radagast', 'gandalf', 'alatar']
					});
				});
			});

			describe('when position argument exceeds the length of the list', () => {
				it('fills the intervening slots with null values', async () => {
					const node = NodeFactory.create({
						wizards: ['saruman', 'radagast']
					});

					await repository.storeNode(node);

					const result = await repository.addValueToList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf',
						5
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['saruman', 'radagast', null, null, null, 'gandalf']
					});
				});
			});
		});
	});

	describe('removeValueFromList()', () => {
		describe('when field does not exist on node', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create();

				await repository.storeNode(node);

				try {
					await repository.removeValueFromList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Unable to find field for key: wizards'
					);
				}
			});
		});

		describe('when field exists but is not an array', () => {
			it('raises an exception', async () => {
				expect.assertions(1);

				const node = NodeFactory.create({
					wizards: 'apply inside'
				});

				await repository.storeNode(node);

				try {
					await repository.removeValueFromList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);
				} catch (error) {
					expect(error.message).toStrictEqual(
						'Field key wizards did not point to an array'
					);
				}
			});
		});

		describe('when the list exists and is an array', () => {
			it('updates the persisted node in the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf', 'saruman']
				});

				await repository.storeNode(node);
				await repository.removeValueFromList(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.type_id,
					node.id
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman']
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf', 'saruman']
				});

				await repository.storeNode(node);

				const result = await repository.removeValueFromList(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman']
				});
			});

			it('does not destructively modify the original node', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf', 'saruman']
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.removeValueFromList(
					node.type_id,
					node.id,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
			});

			describe('when specified value does not exist in list', () => {
				it('returns the original node', async () => {
					const node = NodeFactory.create({
						wizards: []
					});

					await repository.storeNode(node);

					const result = await repository.removeValueFromList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);

					expect(result).toStrictEqual(node);
				});

				it('does not modify the persisted node in the cache', async () => {
					const node = NodeFactory.create({
						wizards: []
					});

					await repository.storeNode(node);
					await repository.removeValueFromList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);

					const persisted_node = await repository.fetchNode(
						node.type_id,
						node.id
					);

					expect(persisted_node).toStrictEqual(node);
				});
			});

			describe('when the specified value does not exist at the indicated position', () => {
				it('raises an exception', async () => {
					expect.assertions(1);

					const node = NodeFactory.create({
						wizards: ['saruman', 'gandalf']
					});

					await repository.storeNode(node);

					try {
						await repository.removeValueFromList(
							node.type_id,
							node.id,
							'wizards',
							'gandalf',
							0
						);
					} catch (error) {
						expect(error.message).toStrictEqual(
							'Expected to see gandalf at index 0, but saw saruman'
						);
					}
				});
			});

			describe('when the position argument is omitted', () => {
				it('removes the last value from the list', async () => {
					const node = NodeFactory.create({
						wizards: ['gandalf', 'saruman', 'gandalf', 'saruman']
					});

					await repository.storeNode(node);

					const result = await repository.removeValueFromList(
						node.type_id,
						node.id,
						'wizards',
						'gandalf'
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['gandalf', 'saruman', 'saruman']
					});
				});
			});
		});
	});
});
