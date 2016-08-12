
default: debug

venv:
	$(source "$VIRTUALENVWRAPPER_SCRIPT")
	$(workon geveze)

venv_dev:
	$(source "$VIRTUALENVWRAPPER_SCRIPT")
	$(workon geveze)

ngrok8888:
	@ngrok http -subdomain=7a6907b0 8888

ngrok3333:
	@ngrok http -subdomain=7a6907b0 3333

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

.PHONY: default run ngrok3333 ngrok8888 venv venv_dev debug tests pipgrade pipgrade_dev

