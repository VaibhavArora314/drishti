# Instructions to run locally
- The device running app and the device running express server and model server should be in same local network/connected to same wifi.
- Find the private ip address of device running express server and model server. In case of windows use `ipconfig` command and use ipv4 address.
- Specify this address in `/components/Camera.js`, specify the ipv4 address like `http://192.168.246.3:3000/predict`.
- Run following cmds:
    ```
    npm i
    npm start
    ```