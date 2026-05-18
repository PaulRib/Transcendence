all:
	docker-compose up --build

clean:
	docker-compose down

fclean:
	docker-compose down -v
	docker system prune -a

re: fclean all

.PHONY: all clean fclean re