# Serial-Plugin
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
