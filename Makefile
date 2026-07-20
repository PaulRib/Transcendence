IP_ADDRESS := $(shell ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' || hostname -I | awk '{print $$1}')

all:
	docker compose up --build

clean:
	docker compose down

fclean:
	docker compose down -v
	docker system prune -a

re: fclean all

.PHONY: all clean fclean re

export IP_ADDRESS