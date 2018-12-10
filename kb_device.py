import mido
import keyboard

#these are arbitrary
ID = [0x1, 0x2, 0x9, 0x5]
SENDID = ID + [0x9, 0x4]

MMC = [0x7f, 0x7f, 0x06]

print (mido.get_output_names()) # <---- this will print out midi ports for next command

outport = mido.open_output('VMK 4') # <--- this must be name of a virtual midi port on your machine as listed by above command


def sendmidi(data_):
    msg = mido.Message('sysex', data=data_)
    outport.send(msg)
    print (msg)


k1 = keyboard.add_hotkey('right', lambda: sendmidi( MMC + [0x04] ) ) # 7f7f0604
k2 = keyboard.add_hotkey('left', lambda: sendmidi( MMC + [0x05] ) ) # 7f7f0605

# send toggle off
send1 = keyboard.add_hotkey('ctrl+shift+1', lambda: sendmidi( SENDID + [0x1] ) )
send2 = keyboard.add_hotkey('ctrl+shift+2', lambda: sendmidi( SENDID + [0x2] ) )
send3 = keyboard.add_hotkey('ctrl+shift+3', lambda: sendmidi( SENDID + [0x3] ) )
send4 = keyboard.add_hotkey('ctrl+shift+4', lambda: sendmidi( SENDID + [0x4] ) )


print("Press ESC to stop.")
keyboard.wait('esc')
keyboard.remove_all_hotkeys()
outport.close()
