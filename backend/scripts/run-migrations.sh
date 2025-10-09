#!/bin/bash
echo "🔄 Running database migrations..."
npm run migration:run
if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migrations failed or no migrations to run"
fi
echo "🚀 Starting application..."
npm run start:prod

