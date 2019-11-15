var Service, Characteristic;

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-udp-service", "UDP", UDP);
}

function UDP(log, config) {
  this.log = log;
  this.name = config.name;
  this.host = config.host;
  this.port = config.port;
  this.mode = config.mode || "switch";
  this.modeConfiguration = config.modeConfig || {"hue": false, "saturation": false, "brightness": false};

  this.plugin = config.plugin;
}

UDP.prototype.getServices = function() {
  const informationService = new Service.AccessoryInformation();
  informationService.setCharacteristic(Characteristic.Manufacturer, "Sn4p3");
  informationService.setCharacteristic(Characteristic.Model, "UDP Service");
  informationService.setCharacteristic(Characteristic.SerialNumber, "1804");
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

function sendUDP(host, port, plugin, variable, value) {
  var message = new Buffer('{"plugin": "$plugin", "var": "$variable", "value": $value}'.replace("$plugin", plugin).replace("$variable", variable).replace("$value", value));

  client.send(message, 0, message.length, port, host, function(err, bytes) {
    if (err) throw err;
  });
}

UDP.prototype.setHue = function(hue, callback) {
  sendUDP(this.host, this.port, this.plugin, "hue", hue);
  callback();
}

UDP.prototype.setSaturation = function(saturation, callback) {
  sendUDP(this.host, this.port, this.plugin, "saturation", saturation);
  callback();
}

UDP.prototype.setBrightness = function(brightness, callback) {
  sendUDP(this.host, this.port, this.plugin, "brightness", brightness);
  callback();
}

UDP.prototype.setOn = function(on, callback) {
	if (on == true) {
    sendUDP(this.host, this.port, this.plugin, "on", on);
	} else {
    sendUDP(this.host, this.port, this.plugin, "on", on);
	}
	callback();
}
