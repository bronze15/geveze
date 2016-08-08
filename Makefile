
default: run

venv:
	$(source "$VIRTUALENVWRAPPER_SCRIPT")
	$(workon geveze)

ngrok:
	@ngrok http -subdomain=7a6907b0 8888

run: venv
	@python -m geveze

.PHONY: default run ngrok venvxgettext --files-from messages.pot --output=tr_TR.pot
