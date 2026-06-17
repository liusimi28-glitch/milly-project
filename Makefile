.PHONY: help install dev build build-docker

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  help                 Show this help message"
	@echo "  install              Install project dependencies"
	@echo "  dev                  Run development server locally"
	@echo "  build                Build the application locally"
	@echo "  build-docker         Build the Docker image"

install: ## Install project dependencies
	npm install

dev: ## Run development server locally
	npm run dev

build: ## Build the application locally
	npm run build

build-docker: ## Build the Docker image
	docker build -t milly-project .
