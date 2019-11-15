var Service, Characteristic;

const SerialPort = require('serialport')

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-serial", "Serial", Serial);
}

function Serial(log, config) {
  this.log = log;
  this.name = config.name;
  this.port = config.port;
  this.baudRate = config.baudRate;
  this.mode = config.mode || "switch";
  this.modeConfiguration = config.modeConfig || {"hue": false, "saturation": false, "brightness": false};

  this.lastHue = 0;
  this.lastBrightness = 0;
  this.lastSaturation = 0;

  const this.serialPort = new SerialPort(port);
}

UDP.prototype.getServices = function() {
  const informationService = new Service.AccessoryInformation();
  informationService.setCharacteristic(Characteristic.Manufacturer, "Sn4p3");
  informationService.setCharacteristic(Characteristic.Model, "Serial Service");
  informationService.setCharacteristic(Characteristic.SerialNumber, "1805");
  informationService.setCharacteristic(Characteristic.FirmwareRevision, "0.0.1");
  service = new Service.Switch(this.name);

  if (this.mode == "switch") {
    service = new Service.Switch(this.name);
    service.getCharacteristic(Characteristic.On).on("set", this.setOn.bind(this));
  } else if (this.mode == "lightbulb") {
    service = new Service.Lightbulb(this.name);
    service.getCharacteristic(Characteristic.On).on('set', this.setOn.bind(this));
    if (this.modeConfiguration.hue == true) {
      service
	     .addCharacteristic(Characteristic.Hue)
	     .on('set', this.setHue.bind(this));
    }
    if (this.modeConfiguration.saturation == true) {
      service
	      .addCharacteristic(Characteristic.Saturation)
	      .on('set', this.setSaturation.bind(this));
    }
    if (this.modeConfiguration.brightness == true) {
      service
        .addCharacteristic(new Characteristic.Brightness())
      	.on('set', this.setBrightness.bind(this));
    }
  }

  return [informationService, service];
}

function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return r + g + b;
}

function sendSerial(var) {
  if (var == "hue" || var == "saturation" || var == "brightness" || var = "on") {
    //send 00+(rgb)
    this.serialPort.write("00" + HSLToHex(this.lastHue, this.lastSaturation, this.lastBrightness));
  } else if (var == "off") {
    //send 00+(000000)
    this.serialPort.write("00000000");
  }
}

Serial.prototype.setHue = function(hue, callback) {
  this.lastHue = hue;
  sendSerial("hue");
  callback();
}

Serial.prototype.setSaturation = function(saturation, callback) {
  this.lastSaturation = setSaturation;
  sendSerial("saturation");
  callback();
}

Serial.prototype.setBrightness = function(brightness, callback) {
  this.lastBrightness = brightness;
  sendSerial("brightness");
  callback();
}

Serial.prototype.setOn = function(on, callback) {
	if (on == true) {
    sendSerial("on");
	} else {
    sendSerial("off");
	}
	callback();
}
