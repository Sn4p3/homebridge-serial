# UDP-Plugin
Example Config:
```
"accessories": [
      {
        "accessory": "Serial",
        "name": "Light",
        "mode": "lightbulb",
        "modeConfig": {"hue": true, "saturation": true, "brightness": true},
        "port": "/dev/serial1",
        "baudRate": 19200
      }
}
```

This accessory sends a udp-message containing a variable and its value parsed in json to a server.
To receive this message, use the homebridge-udp-server. This server is written to handle the messages and pass them to the plugins.
