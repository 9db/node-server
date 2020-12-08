import Repository from 'repository';
import NodeFactory from 'factory/node';
import MemoryAdapter from 'adapter/memory';

describe('Repository', () => {
	const hostname = 'https://9db.org';

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
				expected_node.namespace_key,
				expected_node.type_key,
				expected_node.key
			);

			expect(actual_node).toStrictEqual(expected_node);
		});

		describe('when node does not exist in cache', () => {
			it('returns undefined', async () => {
				const node = await repository.fetchNode('non', 'existent', 'node');

				expect(node).toStrictEqual(undefined);
			});
		});
	});

	describe('storeNode()', () => {
		it('stores the node in the cache', async () => {
			const expected_node = NodeFactory.create();

			await repository.storeNode(expected_node);

			const actual_node = await repository.fetchNode(
				expected_node.namespace_key,
				expected_node.type_key,
				expected_node.key
			);

			expect(actual_node).toStrictEqual(expected_node);
		});
	});

	describe('setField()', () => {
		it('updates the persisted node to include the new field', async () => {
			const node = NodeFactory.create();

			await repository.storeNode(node);

			await repository.setField(
				node.namespace_key,
				node.type_key,
				node.key,
				'wizard',
				'gandalf'
			);

			const persisted_node = await repository.fetchNode(
				node.namespace_key,
				node.type_key,
				node.key
			);

			expect(persisted_node).toStrictEqual({
				...node,
				wizard: 'gandalf',
			});
		});

		it('returns the new node', async () => {
			const node = NodeFactory.create();

			await repository.storeNode(node);

			const result = await repository.setField(
				node.namespace_key,
				node.type_key,
				node.key,
				'wizard',
				'gandalf'
			);

			expect(result).toStrictEqual({
				...node,
				wizard: 'gandalf',
			});
		});

		it('does not destructively modify the input node', async () => {
			const node = NodeFactory.create();
			const original_node = { ...node };

			await repository.storeNode(node);

			await repository.setField(
				node.namespace_key,
				node.type_key,
				node.key,
				'wizard',
				'gandalf'
			);

			expect(node).toStrictEqual(original_node);
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
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: 'apply inside',
				});

				await repository.storeNode(node);

				try {
					await repository.addValueToSet(
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: ['gandalf'],
				});

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.namespace_key,
					node.type_key,
					node.key
				);

				expect(persisted_node).toStrictEqual(node);
			});

			it('returns the same node', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf'],
				});

				await repository.storeNode(node);

				const result = await repository.addValueToSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual(node);
			});
		});

		describe('when set does not yet include specified value', () => {
			it('stores the updated node to the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman'],
				});

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.namespace_key,
					node.type_key,
					node.key
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf'],
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman'],
				});

				await repository.storeNode(node);

				const result = await repository.addValueToSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf'],
				});
			});

			it('does not destructively modify the input node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman'],
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.addValueToSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
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
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: 'apply inside',
				});

				await repository.storeNode(node);

				try {
					await repository.removeValueFromSet(
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: ['saruman'],
				});

				await repository.storeNode(node);
				await repository.removeValueFromSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.namespace_key,
					node.type_key,
					node.key
				);

				expect(persisted_node).toStrictEqual(node);
			});

			it('returns the same node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman'],
				});

				await repository.storeNode(node);

				const result = await repository.removeValueFromSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual(node);
			});
		});

		describe('when set includes specified value', () => {
			it('stores the updated node to the cache', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman', 'gandalf'],
				});

				await repository.storeNode(node);
				await repository.removeValueFromSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.namespace_key,
					node.type_key,
					node.key
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman'],
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman', 'gandalf'],
				});

				await repository.storeNode(node);

				const result = await repository.removeValueFromSet(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman'],
				});
			});

			it('does not destructively modify the input node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman', 'gandalf'],
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.removeValueFromSet(
					node.namespace_key,
					node.type_key,
					node.key,
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
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: 'apply inside',
				});

				await repository.storeNode(node);

				try {
					await repository.addValueToList(
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: ['saruman'],
				});

				await repository.storeNode(node);
				await repository.addValueToList(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.namespace_key,
					node.type_key,
					node.key
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf'],
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman'],
				});

				await repository.storeNode(node);

				const result = await repository.addValueToList(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman', 'gandalf'],
				});
			});

			it('does not destructively modify the input node', async () => {
				const node = NodeFactory.create({
					wizards: ['saruman'],
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.addValueToList(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
			});

			describe('when position argument is zero', () => {
				it('places element at first position in the list', async () => {
					const node = NodeFactory.create({
						wizards: ['saruman'],
					});

					await repository.storeNode(node);

					const result = await repository.addValueToList(
						node.namespace_key,
						node.type_key,
						node.key,
						'wizards',
						'gandalf',
						0
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['gandalf', 'saruman'],
					});
				});
			});

			describe('when position argument is mid-way through the list', () => {
				it('places element at expected position in the list', async () => {
					const node = NodeFactory.create({
						wizards: ['saruman', 'radagast', 'alatar'],
					});

					await repository.storeNode(node);

					const result = await repository.addValueToList(
						node.namespace_key,
						node.type_key,
						node.key,
						'wizards',
						'gandalf',
						2
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['saruman', 'radagast', 'gandalf', 'alatar'],
					});
				});
			});

			describe('when position argument exceeds the length of the list', () => {
				it('fills the intervening slots with null values', async () => {
					const node = NodeFactory.create({
						wizards: ['saruman', 'radagast'],
					});

					await repository.storeNode(node);

					const result = await repository.addValueToList(
						node.namespace_key,
						node.type_key,
						node.key,
						'wizards',
						'gandalf',
						5
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['saruman', 'radagast', null, null, null, 'gandalf'],
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
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: 'apply inside',
				});

				await repository.storeNode(node);

				try {
					await repository.removeValueFromList(
						node.namespace_key,
						node.type_key,
						node.key,
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
					wizards: ['gandalf', 'saruman'],
				});

				await repository.storeNode(node);
				await repository.removeValueFromList(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				const persisted_node = await repository.fetchNode(
					node.namespace_key,
					node.type_key,
					node.key
				);

				expect(persisted_node).toStrictEqual({
					...node,
					wizards: ['saruman'],
				});
			});

			it('returns the updated node', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf', 'saruman'],
				});

				await repository.storeNode(node);

				const result = await repository.removeValueFromList(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(result).toStrictEqual({
					...node,
					wizards: ['saruman'],
				});
			});

			it('does not destructively modify the original node', async () => {
				const node = NodeFactory.create({
					wizards: ['gandalf', 'saruman'],
				});

				const original_node = { ...node };

				await repository.storeNode(node);
				await repository.removeValueFromList(
					node.namespace_key,
					node.type_key,
					node.key,
					'wizards',
					'gandalf'
				);

				expect(node).toStrictEqual(original_node);
			});

			describe('when specified value does not exist in list', () => {
				it('returns the original node', async () => {
					const node = NodeFactory.create({
						wizards: [],
					});

					await repository.storeNode(node);

					const result = await repository.removeValueFromList(
						node.namespace_key,
						node.type_key,
						node.key,
						'wizards',
						'gandalf'
					);

					expect(result).toStrictEqual(node);
				});

				it('does not modify the persisted node in the cache', async () => {
					const node = NodeFactory.create({
						wizards: [],
					});

					await repository.storeNode(node);
					await repository.removeValueFromList(
						node.namespace_key,
						node.type_key,
						node.key,
						'wizards',
						'gandalf'
					);

					const persisted_node = await repository.fetchNode(
						node.namespace_key,
						node.type_key,
						node.key
					);

					expect(persisted_node).toStrictEqual(node);
				});
			});

			describe('when the specified value does not exist at the indicated position', () => {
				it('raises an exception', async () => {
					expect.assertions(1);

					const node = NodeFactory.create({
						wizards: ['saruman', 'gandalf'],
					});

					await repository.storeNode(node);

					try {
						await repository.removeValueFromList(
							node.namespace_key,
							node.type_key,
							node.key,
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
						wizards: ['gandalf', 'saruman', 'gandalf', 'saruman'],
					});

					await repository.storeNode(node);

					const result = await repository.removeValueFromList(
						node.namespace_key,
						node.type_key,
						node.key,
						'wizards',
						'gandalf'
					);

					expect(result).toStrictEqual({
						...node,
						wizards: ['gandalf', 'saruman', 'saruman'],
					});
				});
			});
		});
	});
});
