default: helpers debug

IMAGE_NAME := guneysu/geveze

BUILD_TEST = $(IMAGE_NAME):test
BUILD_LATEST = $(IMAGE_NAME):$(shell git rev-parse --short HEAD)
BUILD_DEV = $(IMAGE_NAME):$(shell git rev-parse --short HEAD)-dev
BUILD_DIRTY =  $(IMAGE_NAME):$(shell git rev-parse --short HEAD)-dirty

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
	@xdg-open http://172.17.0.2:8000 2>/dev/null
	@docker run -it $(BUILD_TEST) 

ngrok8888:
	@ngrok http -subdomain=7a6907b0 8888

ngrok3333:
	@ngrok http -subdomain=7a6907b0 3333

run: 
	@python -Wall -m geveze --logging=debug --autoreload=true --debug=false

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
				docker_pack docker_push docker_run