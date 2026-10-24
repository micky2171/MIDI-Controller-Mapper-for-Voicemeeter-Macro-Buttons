# MIDI Controller Mapper for Voicemeeter Macro Buttons

> **AI-assisted project:** This project was created with the assistance of AI and refined through practical testing and repeated use with MIDI hardware and Voicemeeter Macro Buttons. It is being published in the hope that it makes life easier for others who want a more visual and straightforward way to discover, organise, and configure MIDI controls for Voicemeeter Macro Buttons.

Voicemeeter Macro Buttons is a powerful and flexible tool. This project is intended to complement it by helping with MIDI discovery, visual layout planning, LED testing, and the generation of Macro Buttons configuration files.

A lightweight visual MIDI mapping tool for discovering MIDI control IDs, testing controller LEDs, recreating a physical controller layout on-screen, and exporting configured controls to Voicemeeter Macro Buttons.

The application runs locally using Node.js and the browser Web MIDI API. It does not require Express, native MIDI npm packages, Visual Studio Build Tools, or node-gyp.

## Features

### MIDI discovery

- Automatically detects available MIDI input and output devices.
- Automatically connects to the first available MIDI input and output when the page loads.
- Displays incoming MIDI messages in real time.
- Identifies:
  - Note On and Note Off messages
  - Control Change messages
  - Relative rotary encoder messages
  - Pitch Bend messages
  - MIDI channel, ID, value, and raw message bytes
- Automatically adds newly discovered controls to the visual grid.

### Visual controller layout

- Drag controls around a grid to reproduce the physical layout of a MIDI controller.
- All controls snap to the grid.
- Add controls manually when required.
- Supported grid elements:
  - Buttons
  - Faders and sliders
  - Relative rotary knobs
  - Standalone LEDs
  - Text headings and section titles
- Double-click controls to edit labels or mappings.
- Resize Pitch Bend sliders vertically by dragging the top or bottom edge.
- Layouts are saved automatically in browser storage.
- Import and export layouts as JSON.

### LED testing

- Send Note, Control Change, or Pitch Bend messages to a MIDI output.
- Configure the MIDI channel, control ID, and value.
- Test individual LED IDs.
- Use **Light next ID for 2 seconds** to scan through LED IDs.
- Add the current LED test settings directly to the grid.
- Double-click a standalone grid light to edit:
  - Message type
  - MIDI channel
  - MIDI ID
  - On value
  - Off value
- Click a grid light to toggle its configured On and Off values.

### Voicemeeter integration

The mapper uses the installed Voicemeeter Remote API to read the current Voicemeeter configuration.

Where available, the mapping window displays:

- Voicemeeter Strip names
- Voicemeeter Bus names
- A1 to A5 output buses
- B1 to B3 virtual buses
- Custom Strip and Bus labels
- Assigned output device names

If the Voicemeeter API is unavailable, numeric Strip and Bus indexes remain available.

### Direct mapping from the grid

Double-click a button, knob, or fader, or use the purple **VM** button displayed on the control, to configure its Voicemeeter action directly from the grid.

Mapped controls display a purple border and a badge showing the assigned action.

Supported actions include:

- Strip gain
- Relative Strip gain
- Bus gain
- Relative Bus gain
- Strip mute
- Bus mute
- Strip push-to-talk
- Strip A1 routing
- Strip B1 routing
- Strip audio activity light
- Bus audio activity light
- Restart Audio Engine
- Play/Pause
- Skip Track
- Previous Track
- Custom toggle script
- Custom push script

The control label is also used as the exported Macro Button name.

Pressing **Enter** in the mapping window saves the mapping.

## Voicemeeter actions

### Strip mute

Creates a two-position Macro Button that changes the selected Strip's mute state.

```text
Button ON:
Strip[0].Mute = 1;

Button OFF:
Strip[0].Mute = 0;
```

### Strip push-to-talk

Keeps the selected Strip muted until the physical MIDI button is held.

```text
Initial state:
Strip[0].Mute = 1;

Button held:
Strip[0].Mute = 0;

Button released:
Strip[0].Mute = 1;
```

### Audio activity lights

A physical controller LED can follow the audio level of a selected Voicemeeter Strip or Bus.

Configurable options include:

- Trigger threshold in dB
- Release threshold in dB
- Hold time in milliseconds
- LED On value
- LED Off value

Voicemeeter Macro Buttons uses a combined trigger-channel list. On Voicemeeter Potato:

```text
0-7   = Input Strips in #1 to in #8
8-15  = Output Buses out #1 to out #8
```

This gives the following output-bus trigger indexes:

```text
A1 = 8
A2 = 9
A3 = 10
A4 = 11
A5 = 12
B1 = 13
B2 = 14
B3 = 15
```

### Restart Audio Engine

Restarts the Voicemeeter audio engine and briefly lights the mapped MIDI button.

```text
System.SendMidi("out1", "note-on", 1, 0, 126);
Command.Restart = 1;
Wait(2000);
System.SendMidi("out1", "note-on", 1, 0, 0);
```

The LED On and Off values are taken from the Voicemeeter export settings.

### Media controls

```text
Play/Pause:
System.KeyPress("MEDIAPAUSE");

Skip Track:
System.KeyPress("MEDIANEXT");

Previous Track:
System.KeyPress("MEDIAPREV");
```

Media actions are exported as push buttons with no Button OFF request.

## Requirements

- Windows 10 or Windows 11
- Node.js
- Microsoft Edge or Google Chrome
- A connected MIDI controller
- Voicemeeter, Voicemeeter Banana, or Voicemeeter Potato for Voicemeeter integration
- Voicemeeter Macro Buttons for exported button maps

No npm packages are required.

## Installation

1. Download or clone the repository.
2. Open the project folder.
3. Run:

```bash
node server.js
```

Alternatively, on Windows, double-click:

```text
start.bat
```

4. Open the following address in Microsoft Edge or Google Chrome:

```text
http://localhost:3000
```

## First-time MIDI access

The browser may ask for permission to access MIDI devices.

1. Click **Enable MIDI**.
2. Allow MIDI access when prompted.
3. Select the required MIDI input and output if the automatically selected devices are not correct.

After permission has been granted, the first available input and output are connected automatically on future page loads.

## Basic usage

1. Connect a MIDI controller.
2. Start the application.
3. Press buttons, move faders, and turn knobs on the controller.
4. Newly detected controls will be added to the grid.
5. Drag each control to match its physical position.
6. Double-click controls to add labels and Voicemeeter mappings.
7. Test LED IDs using the LED test panel.
8. Click **Export to Voicemeeter** when the layout and mappings are complete.

## Exporting to Voicemeeter Macro Buttons

1. Map the required controls directly from the grid.
2. Click **Export to Voicemeeter**.
3. Review the configured actions.
4. Set the Macro Buttons MIDI output name, normally `out1`.
5. Set the required LED On and Off values.
6. Click **Download MacroButtons XML**.
7. Open Voicemeeter Macro Buttons.
8. Use **Menu > Load Button Map**.
9. Select the exported XML file.
10. Configure the MIDI input device as the MIDI controller.
11. Configure **MIDI OUT1 Device** as the same controller if LED feedback is required.

## Faders and continuous controls

Pitch Bend faders can be exported as stepped Macro Buttons, but this creates a large number of entries because Macro Buttons matches specific MIDI messages.

For smoother continuous fader control:

1. Put the MIDI controller into User Mode.
2. Configure each fader to send a unique Control Change message.
3. Use Voicemeeter's built-in MIDI Mapping screen for continuous gain control.
4. Continue using Macro Buttons for buttons, LEDs, activity indicators, media controls, and scripted actions.

## Relative rotary encoders

Relative knobs using these values are supported:

```text
Value 65 = turn left
Value 1  = turn right
```

A relative gain mapping exports separate decrease and increase actions.

```text
Turn left:
Strip[0].Gain -= 1;

Turn right:
Strip[0].Gain += 1;
```

## STUDIOFADE8 notes

The project was developed and tested around the SubZero STUDIOFADE8 MIDI Controller.

The LEDs above the STUDIOFADE8 faders can behave as position-mismatch indicators. A flashing fader LED may indicate that the physical fader position does not match the value expected by the connected software. Those indicator LEDs may not behave like ordinary assignable button LEDs.

DAW Mode and User Mode can expose different MIDI behaviour. User Mode is generally more suitable when assigning custom Note or Control Change IDs.

## Project structure

```text
midi-controller-mapper/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── package.json
├── server.js
├── start.bat
└── voicemeeter-reader.ps1
```

### Files

- `server.js` provides a dependency-free local HTTP server and the Voicemeeter API endpoint.
- `voicemeeter-reader.ps1` reads Strip and Bus information from the installed Voicemeeter Remote API DLL.
- `public/app.js` handles MIDI communication, layout editing, mappings, and XML export.
- `public/index.html` contains the web interface.
- `public/styles.css` contains the application styling.
- `start.bat` starts the server and opens the application in the default browser.

## Troubleshooting

### MIDI devices are not shown

- Use Microsoft Edge or Google Chrome.
- Click **Enable MIDI** and allow access.
- Connect the controller before refreshing the device list.
- Close other software that may have exclusive access to the MIDI device.

### LEDs do not respond

- Confirm that the correct MIDI output is connected.
- Test both Note and Control Change messages.
- Verify the channel and ID.
- Try different On values because some controllers use MIDI values for colours or lighting modes.
- Confirm that the LED supports external feedback. Some LEDs are device-controlled status indicators.

### Voicemeeter channel names are unavailable

- Confirm that Voicemeeter is installed and running.
- Click **Refresh channel names**.
- Confirm that either `VoicemeeterRemote64.dll` or `VoicemeeterRemote.dll` exists in the Voicemeeter installation directory.
- The application will fall back to numeric Strip and Bus indexes if the API cannot be reached.

### Exported LED state does not change

- Set **MIDI OUT1 Device** in Voicemeeter Macro Buttons.
- Confirm that the exported output name is `out1`.
- Reload the latest exported XML after changing mappings.
- Check that the controller accepts the configured LED On and Off values.

## Privacy and networking

The application runs locally and does not require an internet connection. MIDI messages, layouts, and Voicemeeter configuration data remain on the local computer.

## License

This project is released under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, provided that the original copyright and licence notice are included.
