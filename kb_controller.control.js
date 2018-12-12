loadAPI(7);

const NAME = "KLF Extensions";

// NOTE: here on the js/controller api side, we must manually add the sysex start and end values.

const SYSEX_START = "f0";
const SYSEX_END = "f7";

const ID = "01020905";
const START = SYSEX_START + ID;

const SENDID = START.concat("0904");
const SENDID1 = SENDID.concat("01").concat(SYSEX_END);
const SENDID2 = SENDID.concat("02").concat(SYSEX_END);
const SENDID3 = SENDID.concat("03").concat(SYSEX_END);
const SENDID4 = SENDID.concat("04").concat(SYSEX_END);

const FIRSTSYNTH = "0909";
const FIRSTSYNTHID = START.concat(FIRSTSYNTH).concat(SYSEX_END);

const OPENMAIN = "0808";
const OPENMAINID = START.concat(OPENMAIN).concat(SYSEX_END);

//const MMC = [0x7f, 0x7f, 0x06]

host.setShouldFailOnDeprecatedUse(true);
host.defineController("KLF", NAME, "0.1", "9a18b7c4-e18a-4b68-a4b9-8cdac877506a", "karbon");
host.defineMidiPorts(1, 0);


function init() {
   transport = host.createTransport();
   host.getMidiInPort(0).setMidiCallback(onMidi0);
   host.getMidiInPort(0).setSysexCallback(onSysex0);
   track = host.createCursorTrack(4, 4);
   track.getSend(0).value().markInterested();
   track.getSend(1).value().markInterested();
   track.getSend(2).value().markInterested();
   track.getSend(3).value().markInterested();
   track.name().markInterested();

   // for open MAIN device
   devices = track.createDeviceBank(32);
   for (var i = 0; i < 32; ++i) {
      devices.getDevice(i).name().markInterested();
      devices.getDevice(i).isWindowOpen().markInterested();
   }
   devices.itemCount().markInterested();
   
   // for open first synth
   synth = track.createCursorDevice("Primary", "No idea", 0, CursorDeviceFollowMode.FIRST_INSTRUMENT);
   synth.isWindowOpen().markInterested();
   synth_open = synth.isWindowOpen();

   println(NAME + " initialized!");
}

function onMidi0(status, data1, data2) {
   // TODO: Implement your MIDI input handling code here.
}

function onSysex0(data) {
   println(data);
   switch (data) {
      case "f07f7f0605f7":
         transport.rewind();
         break;
      case "f07f7f0604f7":
         transport.fastForward();
         break;
      case "f07f7f0601f7":
         transport.stop();
         break;
      case "f07f7f0602f7":
         transport.play();
         break;
      case "f07f7f0606f7":
         transport.record();
         break;

      case SENDID1:
         toggleSend(0);
         break;
      case SENDID2:
         toggleSend(1);
         break;
      case SENDID3:
         toggleSend(2);
         break;
      case SENDID4:
         toggleSend(3);
         break;

      case OPENMAINID:
         openMAIN();
         break;
   
      case FIRSTSYNTHID:
         openSynth();
         break;
   }
}

function openMAIN() {
   println("openMAIN");
   var foundDevice = null;
   const numDevices = devices.itemCount().get();
   println(numDevices);
   for (var i = 0; i < numDevices; i++) {
      foundDevice = devices.getDevice(i);
      var name = foundDevice.name().get();
      println(name);
      if (name.endsWith("MAIN"))
         break;
   }
   if (foundDevice !== null)
      foundDevice.isWindowOpen().toggle();
}

function openSynth() {
   synth_open.toggle();
}


var old_values = [ 0.0, 0.0, 0.0, 0.0 ];

// WARNING!! BRAINDEAD CODE!!!
function toggleSend(number) {
   println("send toggle recieved for " + number);

   if (old_values[number] == 0.0) {
      old_values[number] = track.getSend(number).value().get();
      track.getSend(number).value().set(0.0);

      println('old_value ' + number + ' set to ' + old_values[number] + ' on ' + track.name().get());
   }
   else 
   {
      track.getSend(number).value().set(old_values[number]);
      println('value set to ' + old_values[number] + ' on ' + track.name().get());
      old_values[number] = 0.0;
   }
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}