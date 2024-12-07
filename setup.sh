#!/bin/bash

echo "Setting up the NoteApp Backend..."

# Step 1: Check and install pnpm if not installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm not found, installing..."
    npm install -g pnpm
else
    echo "pnpm is already installed."
fi

# Step 2: Install dependencies
echo "Installing dependencies..."
pnpm install

# Step 3: Create the .env file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat <<EOT > .env
DATABASE_URL="postgresql://admin:WZwRt1HAAoGXW3HOuNdNEW7hemdg0mHZ@dpg-ct8mdn68ii6s73ccpoc0-a.oregon-postgres.render.com/noteapp_db_q6hh"
JWT_SECRET="ENSOLVERS"
EOT
    echo ".env file created."
else
    echo ".env file already exists. Skipping creation."
fi

# Step 4: Initialize Prisma if needed
if [ ! -d prisma ]; then
    echo "Initializing Prisma..."
    pnpm prisma init
else
    echo "Prisma already initialized. Skipping initialization."
fi

# Step 5: Pull database schema
echo "Pulling database schema from remote..."
pnpm prisma db pull

if [ $? -ne 0 ]; then
    echo "Failed to pull database schema. Please check your DATABASE_URL and database connectivity."
    exit 1
fi

# Step 6: Generate Prisma Client
echo "Generating Prisma Client..."
pnpm prisma generate

if [ $? -ne 0 ]; then
    echo "Failed to generate Prisma Client. Please check your schema.prisma."
    exit 1
fi

# Step 7: Apply Prisma migrations
echo "Applying Prisma migrations..."
pnpm prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "Failed to apply migrations. Please check your migrations folder."
    exit 1
fi

# Step 8: Start the backend server
echo "Starting the backend server..."
pnpm start

if [ $? -ne 0 ]; then
    echo "Failed to start the backend server. Please check your code."
    exit 1
fi

echo "Backend setup complete!"
