# Bitwig-Keyboard-Extension-Harness

Pre-requisites: Python, a virtual midi port.

1. Install required Python modules...

```
pip install keyboard

pip install mido

pip install python-rtmidi
```

2. Put the files in your Bitwig Controller Scripts folder. (The .py Python file can be anywhere but one may as well keep them together)

3. Create a virtual midi cable/port on your machine. Attach this to the "KLF Extensions" controller in BW.

4. Edit the python file. The line that says: "outport = mido.open_output('VMK 4') ", change the 'VMK 4' to the name of the virtual midi device on your machine. You can list these with a "print (mido.get_output_names())" from python. This line is in the script, so you can just run the script once. Further details at https://mido.readthedocs.io/en/latest/index.html

5. Execute the kb_device.py Python file. e.g. "python kb_device.py" from a console (I've just been running it in debug mode using vscode)

