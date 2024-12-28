# Gallery Application with Geolocation and SQLite

## Overview
The Gallery Application is a mobile app that allows users to view images, see their locations on a map using geolocation, and store metadata about each image in a local SQLite database. The application leverages geolocation features to tag images with their location and integrates a map view to display where the images were taken. SQLite is used for local data storage, ensuring fast and efficient data management.

## Features
- **Image Gallery**: Displays a grid or list of images stored within the app. Users can view images in full-screen mode or in a carousel/gallery view.
- **Geolocation Integration**: Each image is tagged with its location (latitude and longitude) using the device's geolocation capabilities.
- **Map Integration**: A map (Google Maps/Mapbox) displays the locations of all images with markers indicating where each image was taken.
- **SQLite Database**: Stores image metadata (file paths, timestamps, geolocation data). CRUD operations (Create, Read, Update, Delete) are implemented for managing image data.
- **Search and Filter**: Users can search for images based on location, date, or other metadata and filter images based on specific criteria.
- **Security and Permissions**: The app requests necessary permissions for accessing geolocation data and storing images, with measures in place to protect user data.

## Requirements
- **React Native** or **Expo** (for mobile app development)
- **SQLite** (for local data storage)
- **Geolocation API** (for obtaining location data)
- **Map Integration** (Google Maps/Mapbox)
- **Permissions**: Ensure permissions are requested for accessing geolocation and storing images.

## Installation

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/gallery-app.git
cd gallery-app




