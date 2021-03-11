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

  this.serialPort = new SerialPort(this.port, {
  	baudRate: this.baudRate
  });
}

Serial.prototype.getServices = function() {
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


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function HSVtoHEX(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return componentToHex(r*255) + componentToHex(g*255) + componentToHex(b*255);
}

Serial.prototype.sendSerial = function(variable) {
	try {
  if (variable == "hue" || variable == "saturation" || variable == "brightness" || variable == "on") {
    //send 00+(rgb)
    this.serialPort.write(HSVtoHEX(this.lastHue, this.lastSaturation, this.lastBrightness) + '#');
    console.log("#" + HSVtoHEX(this.lastHue, this.lastSaturation, this.lastBrightness));
  } else if (variable == "off") {
    //send 00+(000000)
    console.log("#000000");
    this.serialPort.write("000000" + '#');
  }
	} catch(e) {
		console.log(e);
	}
}

Serial.prototype.setHue = function(hue, callback) {
  this.lastHue = hue;
  this.sendSerial("hue");
  callback();
}

Serial.prototype.setSaturation = function(saturation, callback) {
  this.lastSaturation = saturation;
  this.sendSerial("saturation");
  callback();
}

Serial.prototype.setBrightness = function(brightness, callback) {
  this.lastBrightness = brightness;
  this.sendSerial("brightness");
  callback();
}

Serial.prototype.setOn = function(on, callback) {
	if (on == true) {
    this.sendSerial("on");
	} else {
    this.sendSerial("off");
	}
	callback();
}
