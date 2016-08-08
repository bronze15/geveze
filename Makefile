
default: debug

venv:
	$(source "$VIRTUALENVWRAPPER_SCRIPT")
	$(workon geveze)

ngrok:
	@ngrok http -subdomain=7a6907b0 8888

run: venv
	@python -m geveze

debug: venv
	@python -Wall -m geveze --logging=debug

.PHONY: default run ngrok venv debug
