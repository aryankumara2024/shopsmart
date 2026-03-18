#!/bin/bash
cd /Users/aryankumar/Desktop/shopsmart/backend
npx prisma generate
npx prisma db push
node seed.js