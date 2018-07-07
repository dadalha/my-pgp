import r2pipe
import sys
import time
from tqdm import tqdm

if len(sys.argv) < 5:
    print("Use `python r2dump.py frida://DEVICE_ID/PID START_ADDRESS LENGTH")
    sys.exit(1)

print("[*] Connecting")
r2 = r2pipe.open(sys.argv[1])
time.sleep(1)

with open("dump.so", "wb") as fp:
    address = int(sys.argv[2], 16)
    size = int(sys.argv[3])
    bb = int(sys.argv[4])
    bar = tqdm(total=size)

    while size > 0:
        h_address = hex(address)
        r2.cmd("s {}".format(h_address))
        
        amount = min(bb, size)
        d = r2.cmd("p8 {}".format(amount))
        fp.write(bytearray.fromhex(d))

        address += amount
        size -= amount
        bar.update(amount)
