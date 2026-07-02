.DEFAULT_GOAL := help

IMAGE_NAME ?= mall

GIT_NEAREST_TAG := $(shell git describe --tags --abbrev=0 2>/dev/null)
GIT_SHORT_HASH := $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
IMAGE_TAG ?= $(if $(GIT_NEAREST_TAG),$(GIT_NEAREST_TAG)-$(GIT_SHORT_HASH),$(GIT_SHORT_HASH))

# 定义一个井号变量，避免被 make 解析为注释
HASH := \#

# 根据操作系统选择不同的 awk 命令和引号，并处理 Windows 下可能的双引号转义问题
ifeq ($(OS),Windows_NT)
    # Windows native cmd.exe 不支持单引号
    HELP_CMD = awk "BEGIN {FS = \":.*?$(HASH)$(HASH) \"}; /^[a-zA-Z0-9_-]+:.*?$(HASH)$(HASH) / {printf \"  %-20s %s\n\", \$$1, \$$2}" $(MAKEFILE_LIST)
else
    # Linux/Mac 支持单引号和 ANSI 颜色输出
    HELP_CMD = awk 'BEGIN {FS = ":.*?$(HASH)$(HASH) "}; /^[a-zA-Z0-9_-]+:.*?$(HASH)$(HASH) / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
endif

.PHONY: help
help: ## 显示此帮助信息 (Show this help message)
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@$(HELP_CMD)

.PHONY: install
install: ## 安装依赖 (Install dependencies)
	pnpm install

.PHONY: dev
dev: ## 启动本地开发服务器 (Start development server)
	pnpm dev

.PHONY: build
build: ## 构建生产环境产物 (Build for production)
	pnpm build

.PHONY: clean
clean: ## 清除构建产物和依赖 (Clean build outputs and modules)
	rm -rf node_modules .nuxt .output

.PHONY: print-image-tag
print-image-tag: ## 输出默认镜像标签 (Print default image tag)
	@echo $(IMAGE_TAG)

.PHONY: docker-build
docker-build: ## 构建 Docker 镜像 (Build Docker image)
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
