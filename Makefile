# Makefile for Docker Compose

# Start the Docker Compose services
docker-up:
	@docker-compose up -d

# Stop and remove the Docker Compose services
docker-down:
	@docker-compose down

# Show the status of the Docker Compose services
docker-status:
	@docker-compose ps

# Clean up Docker resources
docker-clean:
	@docker-compose down -v --remove-orphans

db-reset:
	docker-compose down
	docker-compose up -d
	@echo "Waiting for database to be ready..."
	@timeout 5 > NUL
	@echo "Running migrations..."
	bun run db:migrate

db-reset-migrate:
	docker-compose down
	docker-compose up -d
	@echo "Waiting for database to be ready..."
	@timeout 3 > NUL
	@echo "Generate schemas..."
	bun run db:generate
	@echo "Running migrations..."
	bun run db:migrate

.PHONY: docker-up docker-down docker-status docker-clean db-reset db-reset-migrate

