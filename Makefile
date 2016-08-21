default: debug

IMAGE_NAME := guneysu/geveze

BUILD_TEST = $(IMAGE_NAME):test
BUILD_LATEST = $(IMAGE_NAME):$(shell git rev-parse --short HEAD)
BUILD_DEV = $(IMAGE_NAME):$(shell git rev-parse --short HEAD)-dev
BUILD_DIRTY =  $(IMAGE_NAME):$(shell git rev-parse --short HEAD)-dirty

static:
	$(MAKE) -C www prod

docker_pack:
	@docker build -t $(BUILD_TEST) geveze
	@docker build -t $(BUILD_LATEST) geveze
	@docker build -t $(BUILD_DEV) geveze
	@docker build -t $(BUILD_DIRTY) geveze

docker_push:
	@docker push $(BUILD_TEST)
	@docker push $(BUILD_LATEST)
	@docker push $(BUILD_DEV)
	@docker push $(BUILD_DIRTY)

docker_run: docker_pack
	@xdg-open http://localhost:8001/static/video.html 2>/dev/null
	@docker run -p 127.0.0.1:8001:8000 -it $(BUILD_TEST)

ngrok8000:
	@ngrok http -subdomain=7a6907b0 8000

ngrok3333:
	@ngrok http -subdomain=7a6907b0 3333

run:
	@python -Wall -m geveze --logging=info --autoreload=false --debug=false

debug:
	@python -Wall -m geveze --logging=debug --autoreload=true --debug=true

tests:
	@python tests/__init__.py

pipgrade:
	@pip install -r geveze/requirements.txt

pipgrade_dev:
	@pip install -r geveze/requirements.dev.txt

.PHONY: default run debug tests pipgrade pipgrade_dev \
				ngrok3333 ngrok8888 \
				docker_pack docker_push docker_run \
				static
