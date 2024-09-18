PROJECT_NAME := relayer-admin-dashboard
DOCKER_IMAGE_NAME := iconcommunity/relayer-admin-dashboard
TAG := $(shell git describe --tags --abbrev=0)
PLATFORMS := linux/amd64,linux/arm64

all: build

build:
	docker buildx build --platform $(PLATFORMS) -t $(DOCKER_IMAGE_NAME):$(TAG) -t $(DOCKER_IMAGE_NAME):latest  .

run:
	docker run -p 3000:3000 --name $(PROJECT_NAME) $(DOCKER_IMAGE_NAME):$(TAG)

stop:
	docker stop $(PROJECT_NAME)
	docker rm $(PROJECT_NAME)

.PHONY: all build run stop