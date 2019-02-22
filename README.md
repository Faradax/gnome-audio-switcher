# gnome-audio-switcher
One-Click widget to cycle all sink-inputs through available audio sinks.

For two available sinks - for example, a headset and speakers - that basically means a painless, one-click toggle!

# Troubleshooting
## Some applications won't move their audio streams
German blogger Felix Becker has a [short blog post](https://metacoder.de/entry/Steam---X-Plane-auf-Linux--Pavucontrol-erlaubt-Umschalten-des-Output-devices-nicht-13) which concludes that for applications using [openal-soft](https://github.com/kcat/openal-soft), a *config file* has to be created or edited to be able to move their streams:

`~/.alsoftrc`:
```
[pulse]
allow-moves=yes
```
Some more information about the implications of this flag can be found in the openal-soft repository in the [example alsoftrc file](https://github.com/kcat/openal-soft/blob/7d821551ac32c6775d1f02a4631bd050aabcc254/alsoftrc.sample#L334).