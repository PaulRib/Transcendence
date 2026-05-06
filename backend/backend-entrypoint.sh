#!/bin/sh 

sleep 5

npx prisma migrate deploy

npx prisma db seed

npm run start:prod