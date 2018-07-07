import time
import frida
import json
import sys


def printable(data):
    return str(bytes(data).hex())

def message_handler(message, payload):
    #mainly printing the data sent from the js code, and managing the cipher objects according to their operation mode
    if message["type"] != "send":
        print(message)
        return

    data = json.loads(message['payload'])
    if 'CryptType' in data:
        print("===> {}::{}: {}".format(data['Type'], data['CryptType'], printable(payload)))

    elif data['Type'] == 'log':
        print(data['Log'])

    elif 'method' in data:
        print("===> {}::{} {}".format(data['Type'], data['Method'], data['Data']))
        if payload:
            print('\t{}'.format(printable(payload)))

    elif data['Type'] == 'Gatt':
        print("===> Gatt::{} [{}]: {}".format(data["Gatt"], data['Characteristic'], printable(payload)))
    
    elif data["Type"] == "Debug":
        print(data["Debug"])
    
    else:
        print(message)


print("[*] Connecting")
device = frida.get_usb_device()
time.sleep(1)  # Without it Java.perform silently fails

if len(sys.argv) > 1:
    pid = int(sys.argv[1])
else:
    sys.exit(0)
    print("[*] Spawning")
    pid = device.spawn("com.nianticlabs.pokemongo")
    print(device.resume(pid))

print("[*] Attaching: {}".format(pid))
session = device.attach(pid)

# for module in session.enumerate_modules():
#     print('MODULE: %s' % module)

with open("script.js") as f:
    script = session.create_script(f.read())

script.on("message", message_handler)  # register the message handler
script.load()

input()
