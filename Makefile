install: install-deps

run:
	bin/gendiff.js __fixtures__/simple_file1.json __fixtures__/simple_file2.json

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test
