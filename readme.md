# odoq
[![Build Status](https://travis-ci.org/millette/odoq.svg?branch=master)](https://travis-ci.org/millette/odoq)
[![Coverage Status](https://coveralls.io/repos/github/millette/odoq/badge.svg?branch=master)](https://coveralls.io/github/millette/odoq?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/odoq.svg)](https://gemnasium.com/github.com/millette/odoq)
> Observatoire des données ouvertes du Québec.

## Install
```
$ npm install --save odoq
```

## Now with update-notifier
The cli now uses [update-notifier][] to let the user know about updates to this program.

Users have the ability to opt-out of the update notifier by changing
the optOut property to true in ~/.config/configstore/update-notifier-rollodeqc-gh-user-streak.json.
The path is available in notifier.config.path.

Users can also opt-out by setting the environment variable NO_UPDATE_NOTIFIER
with any value or by using the --no-update-notifier flag on a per run basis.

## Usage
```js
const odoq = require('odoq')

odoq('unicorns')
//=> 'unicorns & rainbows'
```

## API
### odoq(input, [options])
#### input
Type: `string`

Lorem ipsum.

#### options
##### foo
Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## CLI
```
$ npm install --global odoq
```

```
$ odoq --help

  Usage
    odoq [input]

  Options
    --foo  Lorem ipsum. [Default: false]

  Examples
    $ odoq
    unicorns & rainbows
    $ odoq ponies
    ponies & rainbows
```


## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)

[update-notifier]: <https://github.com/yeoman/update-notifier>
