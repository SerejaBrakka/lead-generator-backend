Генерация миграции для текущего конфига внутри докер контейнера
docker-compose exec backend npx typeorm migration:generate -d dist/db/data-source.js dist/db/migrations/AddTestColumn -o

применение миграции
docker-compose exec backend npx typeorm migration:run -d dist/db/data-source.js
