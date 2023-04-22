<picture>
 <source media="(prefers-color-scheme: light)" srcset="https://github.com/rogersi9/NeuroNote/blob/main/client2/public/logo-black.svg">
 <img alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://github.com/rogersi9/NeuroNote/blob/main/client2/public/logo-white.svg">
</picture>

**Our app aims to simulate taking input from an EEG device to convert brain signals into music, allowing users to choose their preferred instrument from a list of options.**

# Setting up the project

## Clone the repository

1. Open a terminal window and navigate to the directory where you want to clone the project.
2. Run the following command:
   `git clone https://github.com/rogersi9/NeuroNote.git`

## Backend setup

### Prerequisites

- Node.js (v14 or higher)

### Running the server

1. go to the "backend" directory
2. run `npm install`
3. run `npm run start:dev`
4. visit <a href="http:localhost:7070/api">localhost:7070/api</a> to view the documentation of our APIs.

## Frontend setup

### Prerequisites

- Node.js (v14 or higher)

### Running the frontend

1. go to the "client2" directory
2. run `npm install` (If you get an error, try `npm install --force`)
3. run `npm start`
4. visit <a href="http:localhost:3000">localhost:3000/api</a>.
