// @flow

/* eslint-disable no-console */
import { Board, Led } from 'johnny-five';
import express from 'express';
import { Server } from 'http';
import socketIO from 'socket.io';

// Make a new Express app
const app = express();
// flow-disable-next-line
const http = Server(app);
// Make a new Socket.IO instance and listen to the http port
const io = socketIO.listen(http);

// We have a dist directory, but use '/static' to fetch it.
app.use('/static', express.static('dist'));

// When the client is on the root, show the HTML file.
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// Set the server to port 8000 and send the HTML from there.
http.listen(8000, () => {
  console.log('Server running on Port 8000');
});

// Set `lightOn` to true as a default since our LED will be on
let lightOn = true;

// Make a new Board Instance
const board = new Board();

// When the board is connected, turn on the LED connected to pin 9
board.on('ready', function() {
  console.log('[johnny-five] Board is ready.');

  // Make a new Led object and connect it to pin 9
  const led = new Led(9);

  // Switch it on!
  led.on();

  /**
   *
   * Server-Side Socket Events
   *
   * When the client-side has connected, output the status to console.
   * Then, send the current LED status to the client-side.
   *
   * When the LED is toggled from the client-side, update the lightOn variable.
   * Depending on the boolean sent, turn on or off the LED.
   *
   */
  io.on('connect', (socket) => {
    console.log('[socket.io] Client has connected to server!');
    socket.emit('light-state', lightOn);

    socket.on('light-toggle', (lightToggle) => {
      lightOn = lightToggle;

      // Log the current state of the LED.
      console.log(`[socket.io] Light is now ${lightOn ? 'on' : 'off'}.`);

      if (lightOn) {
        led.on();
      } else {
        led.stop().off();
      }
    });
  });

  // REPL object so we can interact with our LED
  this.repl.inject({
    // Control the LED via calling for the object
    led,
    // switchOn and switchOff functions to turn LED on and off using REPL
    switchOn: () => {
      if (lightOn) {
        console.log('[johnny-five] LED is already on!');
      } else {
        led.on();
        lightOn = true;
      }
    },
    switchOff: () => {
      if (!lightOn) {
        console.log('[johnny-five] LED is already off!');
      } else {
        led.stop().off();
        lightOn = false;
      }
    },
  });

  // When the board is closing, stop any LED animations and turn it off
  this.on('exit', () => {
    led.stop().off();
    console.log('[johnny-five] Bye Bye.');
  });

});
