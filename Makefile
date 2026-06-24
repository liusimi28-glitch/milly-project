.PHONY: help install dev dev-server dev-all build build-docker

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  help                 Show this help message"
	@echo "  install              Install project dependencies"
	@echo "  dev                  Run development server locally"
	@echo "  dev-server           Run auth API server locally"
	@echo "  dev-all              Run frontend and auth API together"
	@echo "  build                Build the application locally"
	@echo "  build-docker         Build the Docker image"

install: ## Install project dependencies
	npm install
	npm --prefix server install

dev: ## Run development server locally
	npm run dev

dev-server: ## Run auth API server locally
	npm run dev:server

dev-all: ## Run frontend and auth API together
	npm run dev:all

build: ## Build the application locally
	npm run build

build-docker: ## Build the Docker image
	docker compose build
