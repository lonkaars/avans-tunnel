# tunnel challenge stuff

HMI software stack:

- vanilla HTML/CSS/JS webpage as UI
- display webpage fullscreen using Chromium in kiosk mode
- use websocat to convert TCP socket connections to WebSocket
- nginx for static hosting

## bonus bits

- mock WebSocket server
  ```sh
  websocat -s 8081
  ```
- mock TCP server
  ```sh
  socat stdio tcp-listen:8079
  ```
  or
  ```sh
  nc -lp 8079
  ```
  (both of these need `while :; do ... ; done` loops to keep them running
  indefinitely)
- forward TCP server to WebSocket
  ```sh
  websocat --text ws-listen:127.0.0.1:8081 tcp:127.0.0.1:8079
  ```

