.PHONY: clean
clean:
	@docker-compose down --remove-orphans

.PHONY: api
api: clean
	@COMMAND='npm dev' docker-compose run --service-ports api

.PHONY: test
test: clean
	@COMMAND='npm test' docker-compose run --service-ports test