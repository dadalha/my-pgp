import time
import frida
import json
import sys
import argparse

def printable(data):
    return str(bytes(data).hex())

def message_handler(message, payload):
    #mainly printing the data sent from the js code, and managing the cipher objects according to their operation mode
    if message["type"] != "send":
        print(message)
        return

    try:
        data = json.loads(message['payload'])
    except:
        print(message)
        print(payload)
        return
    
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


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('-s', '--script', action='append', nargs=1)
    parser.add_argument('-p', '--pid', type=int, default=None)
    parser.add_argument('-c', '--spawn', type=str, default=None)
    args = parser.parse_args()

    if args.pid and args.spawn:
        print("Do not specify --pid and --spawn at the same time")
        return

    if not args.pid and not args.spawn:
        print("Specify either --pid or --spawn")
        return

    print("[*] Connecting")
    device = frida.get_usb_device()
    time.sleep(1)  # Without it Java.perform silently fails

    if args.pid:
        pid = args.pid
    else:
        print("[*] Spawning")
        pid = device.spawn(args.spawn)
        device.resume(pid) # Must do it now or it times out 

    print("[*] Attaching: {}".format(pid))
    session = device.attach(pid)

    for (scriptname,) in args.script:
        with open(scriptname) as f:
            script = session.create_script(f.read())
            script.on("message", message_handler)  # register the message handler
            script.load()

    input()

# Usage example
# python hook.py --spawn=com.android.chrome ript=fake-no-root.js --script=fake-no-emulator.js --script=connect-script.js
main()
