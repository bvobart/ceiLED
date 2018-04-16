import mraa
import signal
import sys
import threading
import time

shouldClose = False
def close(sig, frame):
  shouldClose = True
  sys.exit()

class Pin(object):
  pwmFrequency = 50 # Hz
  cycleLength = 1/pwmFrequency # seconds

  def __init__(self, pinNr):
    self.pinNr = pinNr
    self.pin = mraa.Gpio(pinNr)
    self.pin.dir(mraa.DIR_OUT)
    self.value = 0
    self.pwmThread = threading.Thread(
      name="PWM Pin " + str(self.pinNr), 
      target=self.__setValue,
      kwargs={ 'value': self.value }
    )
    self.pwmThread.daemon = True
    self.pwmThread.start()

  def setValue(self, value):
    "Sets a value on the pin. Value should be a value between 0 and 255."
    assert value >= 0 and value <= 255
    self.value = value
    print('Setting pin', self.pinNr, ' to ', self.value)
  
  def __setValue(self, value):
    "Only to be used as target for a thread, as this method is blocking."
    while not shouldClose:
      duty = value / 255
      timeOn = duty * Pin.cycleLength # seconds pin should be on
      timeOff = Pin.cycleLength - timeOn # seconds pin should be off

      if timeOn == 0:
        self.pin.write(0)
        time.sleep(timeOff)
      elif timeOff == 0:
        self.pin.write(1)
        time.sleep(timeOn)
      else:
        self.pin.write(1)
        time.sleep(timeOn)
        self.pin.write(0)
        time.sleep(timeOff)


print('LEDDriver: Initialising')
signal.signal(signal.SIGINT, close)
pins = { x: Pin(x) for x in (3, 5, 7, 11, 13, 15, 19, 21, 23)}
print('LEDDriver: Ready!')

while not shouldClose:
  line = sys.stdin.readline()

  args = line.split(' ')
  if (len(args) != 2):
    print('LEDDriver: Invalid command')
    continue

  pinNr = int(args[0])
  if pinNr % 2 == 0 or pinNr < 3 or pinNr > 23 or pinNr == 9 or pinNr == 17:
    print('LEDDriver: Incorrect Pin %d' % pinNr)
    continue

  value = int(args[1])
  if value < 0:
    value = 0
  elif value > 255:
    value = 255
  
  print('LEDDriver: Pin %d set to %d' % (pinNr, value))
  pins[pinNr].setValue(value)
