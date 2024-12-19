#!/bin/bash

verbose=0
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -v|--verbose) verbose=1 ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found."
    echo "Please create a .env file with your OpenAI API key."
    exit 1
fi

# Check OpenAI API key
default_key="your-opena-api-key-here"
api_key=$(grep -E "^OPENAI_API_KEY=" .env | cut -d'=' -f2 | tr -d ' "')

if [ -z "$api_key" ]; then
    echo "Error: OPENAI_API_KEY not found in .env file."
    exit 1
fi

if [ "$api_key" = "$default_key" ]; then
    echo "Error: Please replace the default OpenAI API key in .env file with your actual key."
    exit 1
fi

if [ $verbose -eq 1 ]; then
    echo "Starting ZyberTrain Docker containers..."
    docker compose up --build --force-recreate --remove-orphans
else
    docker compose up --build --force-recreate --remove-orphans --quiet-pull 2>/dev/null
fi

if [ $verbose -eq 1 ]; then
    echo
    echo "Cleaning up ZyberTrain Docker resources..."
    docker compose down --rmi all --volumes --remove-orphans
else
    docker compose down --rmi all --volumes --remove-orphans >/dev/null 2>&1
fi
