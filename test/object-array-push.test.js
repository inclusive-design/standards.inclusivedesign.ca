import assert from 'node:assert';
import test from 'node:test';
import objectArrayPush from '../src/assets/scripts/object-array-push.js';

const objectArray = {
	projects: [],
	topics: [],
};

test('A single item can be pushed to the object array', () => {
	assert.deepStrictEqual(objectArrayPush(objectArray, 'projects', 'project1'), {
		projects: ['project1'],
		topics: [],
	});
});

test('An array item can be pushed to the object array', () => {
	assert.deepStrictEqual(objectArrayPush(objectArray, 'topics', ['topic1', 'topic2']), {
		projects: ['project1'],
		topics: ['topic1', 'topic2'],
	});
});

test('Duplicated item is omitted', () => {
	assert.deepStrictEqual(objectArrayPush(objectArray, 'projects', 'project1'), {
		projects: ['project1'],
		topics: ['topic1', 'topic2'],
	});

	assert.deepStrictEqual(objectArrayPush(objectArray, 'projects', ['project1']), {
		projects: ['project1'],
		topics: ['topic1', 'topic2'],
	});

	assert.deepStrictEqual(objectArrayPush(objectArray, 'topics', ['topic1', 'topic2', 'topic3']), {
		projects: ['project1'],
		topics: ['topic1', 'topic2', 'topic3'],
	});
});
