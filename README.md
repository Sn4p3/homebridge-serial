# UDP-Plugin
Example Config:
```
"accessories": [
      {
        "accessory": "UDP",
        "name": "Light",
        "mode": "lightbulb",
        "modeConfig": {"hue": true, "saturation": true, "brightness": true},
        "plugin": "IRRemote",

        "host": "127.0.0.1",
        "port": 1234
      }
}
```

This accessory sends a udp-message containing a variable and its value parsed in json to a server.
To receive this message, use the homebridge-udp-server. This server is written to handle the messages and pass them to the plugins.
