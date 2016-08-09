
default: debug

venv:
	$(source "$VIRTUALENVWRAPPER_SCRIPT")
	$(workon geveze)

venv_dev:
	$(source "$VIRTUALENVWRAPPER_SCRIPT")
	$(workon geveze)

ngrok:
	@ngrok http -subdomain=7a6907b0 8888

run: venv
	@python -m geveze

debug: venv
	@python -Wall -m geveze --logging=debug --autoreload=true --debug=true

tests:
	@python tests/__init__.py


pipgrade: venv
	@pip install -r geveze/requirements.txt

pipgrade_dev: venv_dev
	@pip install -r geveze/requirements.dev.txt

.PHONY: default run ngrok venv venv_dev debug tests pipgrade pipgrade_dev

