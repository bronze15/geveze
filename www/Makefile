default: debug

debug:
	@brunch watch --server 

run:
	@npm run start

prod:
	@npm run prod

production:
	@brunch build --production

live:
	@brunch w --server --production

deploy: prod
	@cd public/ && \
		git add . --all; \
		git commit -m "`date`"

.PHONY: default run prod production live deploy
