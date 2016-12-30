SHELL  := /bin/bash
PATH   := node_modules/.bin:$(PATH)
TEST_DB ?= POSTGRES_CONN_URI=postgres://postgres:password@localhost:5432/boldr_test
CI_DB ?= POSTGRES_CONN_URI=postgres://ubuntu@127.0.0.1:5432/circle_test

.PHONY: clean

flow:
	./node_modules/.bin/flow check

test-ci:
	NODE_ENV=test CI=true jest -w 2

build-docker:
	cd dist; docker build -t imgsonl .

prep-docker:
	cp Dockerfile docker-compose.yml dist/ && mkdir dist/vhost && cp vhost/imgsonl.conf dist/vhost/imgsonl.conf && cp vhost/i.imgsonl.conf dist/vhost/i.imgsonl.conf

create-dist:
	rm -rf dist && mkdir dist && mv Imgs dist && cp .env dist/ && mkdir dist/bin && cp bin/run.js dist/bin/ && cp package.json dist/package.json

release: build-cms create-dist

test-ci:
	NODE_ENV=test BABEL_ENV=test $(CI_DB) TOKEN_SECRET=bbbbaaaasss jest -w 2

test:
	NODE_ENV=test $(TEST_DB) npm run test
