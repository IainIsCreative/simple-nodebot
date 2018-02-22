// @flow

/* eslint-disable no-console */

import 'babel-polyfill';
import socketIOClient from 'socket.io-client';

// Set socketIO to the window location given by the server
// eslint-disable-next-line no-undef
const io = socketIOClient(window.location.name);

// Get the button for the LED toggle in the DOM
// eslint-disable-next-line no-undef
const ledToggle = document.getElementById('led-toggle');

// Set browser-side lightOn variable as true by default
let lightOn = true;

/**
 *
 * Client-Side Socket Events
 *
 * On connection, tell the server that the client side has connected.
 * Upon connection, a 'light-state' event may be sent from the server.
 * Set the lightOn variable to the current state on the server side.
 *
 */
io.on('connect', () => {
  console.log('[socket.io] Client has Connected!');

  // Get robot's current light state from the server side.
  io.on('light-state', (lightState) => {
    console.log(`[socket.io] Light is currently ${lightState ? 'on' : 'off'}.`);
    lightOn = lightState;
    if (ledToggle && !lightOn) {
      ledToggle.innerHTML = 'Turn On LED';
    }
  });
});

/**
 *
 * If the LED toggle button is found in the DOM, check when it's clicked.
 * When clicked, update the lightOn boolean, then send the value down to the
 * server and update the robot's LED state.
 *
 */
if (ledToggle) {
  ledToggle.addEventListener('click', () => {
    if (lightOn) {
      lightOn = false;
      ledToggle.innerHTML = 'Turn On LED';
    } else {
      lightOn = true;
      ledToggle.innerHTML = 'Turn Off LED';
    }

    // Send new value down to the server.
    io.emit('light-toggle', lightOn);
  });
}
