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

.PHONY: docker-up docker-down docker-status docker-clean
