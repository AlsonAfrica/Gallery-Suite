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
    [git clone https://github.com/yourusername/gallery-app.git](https://github.com/AlsonAfrica/Gallery-Suite.git)

### 2. Installed Dependencies:
    ```bash
      npm install

### 3. Run Project:
    ```bash
      npx expo start

# Usage

## Image Gallery:

- The app displays a grid or list of images stored locally.
- Users can swipe through images or view them in full-screen mode.
- Images are tagged with their location, which is displayed on a map.

## Geolocation and Map:
- When an image is taken, its geolocation is automatically captured (latitude and longitude).
- The map displays the image's location using a marker.
- Users can zoom in/out on the map and interact with it.

## SQLite Database:
- Image metadata (file path, timestamp, latitude, longitude) is stored in the SQLite database.
- CRUD operations are available for adding, viewing, updating, and deleting image data.

## Search and Filter:
- Users can search for images by location, date, or metadata.
- Filtering options are available to view images based on specific criteria.

## Security and Permissions:
- The app requests permissions to access geolocation data and store images.
- All data stored in SQLite is encrypted to ensure security.

## Documentation:
- User Guide: Step-by-step instructions on how to use the gallery, view images, and interact with the map.
- Developer Documentation: Includes setup instructions, an overview of the code structure, and guidelines for future maintenance and updates.

# License
This project is licensed under the MIT License - see the LICENSE file for details.









