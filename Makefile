all:
	docker-compose up --build

clean:
	docker-compose down

fclean:
	docker-compose down -v
	docker system prune -a

.PHONY: all clean fclean