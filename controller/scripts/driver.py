import mraa
import sys

# TODO: Initialise pins

while True:
  line = sys.stdin.readline()

  args = line.split(' ')
  if (len(args) != 2):
    print('Invalid command')
    continue

  pinNr = int(args[0])
  if pinNr % 2 == 0 or pinNr < 3 or pinNr > 23 or pinNr == 9 or pinNr == 17:
    print('Incorrect Pin %d' % pinNr)
    continue

  value = int(args[1])
  if value < 0:
    value = 0
  elif value > 255:
    value = 255
  
  print('Pin %d set to %d' % (pinNr, value))
  # TODO: actually set pin value
