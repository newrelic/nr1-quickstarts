#!/usr/bin/env bash

# Clean the data dir
echo ">"
echo "> Cleaning data dir"
echo ">"
rm -rfv public/data/*

# Copy the dashboard data
echo ">"
echo "> Copying dashboard data"
echo ">"
mkdir public/data || true
cp -v -R dashboards/* public/data

# Generate summary file
echo ">"
echo "> Generating data for use in React"
echo ">"
node generate.js
