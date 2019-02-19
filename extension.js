const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Util = imports.misc.util;
const ByteArray = imports.byteArray;

let text, button;

function _toggle() {
    const sink = _findNextSink();
    log("found next sink", sink, sink.index);

    let sinkIndex = sink.index;
    _getSinkInputs().forEach(sinkInput => {
        _moveSinkInput(sinkInput.index, sinkIndex);
    });
    _setDefaultSink(sinkIndex);
}

function _moveSinkInput(sinkInputIndex, sinkIndex) {
    let commandString = `pactl move-sink-input ${sinkInputIndex} ${sinkIndex}`;
    Util.spawnCommandLine(commandString);
}

function _setDefaultSink(sinkIndex) {
    let commandString = `pactl set-default-sink ${sinkIndex}`;
    Util.spawnCommandLine(commandString);
}

function _listSinksFromPactl() {
    let output = ByteArray.toString(GLib.spawn_command_line_sync("pactl list sinks short")[1]);
    return output;
}

function _listSinkInputsFromPactl() {
    let output = ByteArray.toString(GLib.spawn_command_line_sync("pactl list sink-inputs short")[1]);
    return output;
}

function _getSinks() {
    let output = _listSinksFromPactl();
    let sinkLines = output.split("\n");
    let sinks = sinkLines
        .filter((line) => line.length != 0)
        .map((line) => {
            const parts = line.split("\t");
            return { index: parts[0], state: parts[4] };
        });
    return sinks;
}

function _getSinkInputs() {
    let output = _listSinkInputsFromPactl();
    let sinkInputLines = output.split("\n");
    let sinkInputs = sinkInputLines
        .filter((line) => line.length != 0)
        .map((line) => {
            const parts = line.split("\t");
            return { index: parts[0], sinkIndex: parts[1] };
        });
    return sinkInputs;
}

function _findCurrentSink(sinks) {
    return sinks.find((sink) => sink.state == "RUNNING");
}

function _findNextSink() {
    let sinks = _getSinks();
    let currentSink = _findCurrentSink(sinks);

    let currentSinkListPosition = sinks.indexOf(currentSink);
    let nextSinkListposition = (currentSinkListPosition + 1) % sinks.length;

    return sinks[nextSinkListposition];
}

function init() {
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true
    });
    let icon = new St.Icon({
        icon_name: 'system-run-symbolic',
        style_class: 'system-status-icon'
    });

    button.set_child(icon);
    button.connect('button-press-event', _toggle);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}