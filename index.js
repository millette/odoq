/*
Observatoire des données ouvertes du Québec.

Copyright 2016
Robin Millette <mailto:robin@millette.info>
<http://robin.millette.info>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the
[GNU Affero General Public License](LICENSE.md)
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

// core
const EventEmitter = require('events')

// npm
const gotImp = require('got')
const pThrottle = require('p-throttle')
const FeedParser = require('feedparser')

const got = pThrottle(gotImp, 5, 700)
const gotStream = gotImp.stream.bind(gotImp)

class Smoker extends EventEmitter { }

const doItem = (smoker, item) => {
  got(item.enclosures[0].url, { json: true })
    .then((res) => {
      item.enclosureJson = res.body
      // TODO
      // console.log('ITEM:', item.link, JSON.stringify(item, null, '  '))
      smoker.emit('item', item)
    })
    .catch((error) => {
      console.error('ERROR:', error)
      error.what = 'Item'
      smoker.emit('error', error)
    })
}

const isNext = (y) => y['@'] && y['@'].href && y['@'].rel === 'next'

const nextLink = (meta) => {
  if (!meta['atom:link']) { return false }
  const x = meta['atom:link'].filter(isNext)
  return x.length === 1 && x[0]['@'] && x[0]['@'].href
}

const doPage = (smoker, feedurl, recursive) => {
  const feedparser = new FeedParser({ addmeta: false, feedurl })
  const s = gotStream(feedurl)

  s.on('error', (err) => {
    err.what = 'Stream Error'
    smoker.emit('error', err)
  })

  feedparser.on('error', (err) => {
    err.what = 'FeedParser Error'
    smoker.emit('error', err)
  })

  feedparser.on('meta', (meta) => {
    smoker.emit('meta', meta)
    const next = recursive && nextLink(meta)
    if (next) { doPage(smoker, next, true) }
  })

  s.on('response', (res) => {
    if (res.statusCode !== 200) {
      const err = new Error('Bad status code')
      err.url = res.url
      statusCode.url = res.statusCode
      return s.emit('error', err)
    }
    s.pipe(feedparser)
  })

  feedparser.on('readable', () => {
    let item
    while ((item = feedparser.read())) {
      if (item.enclosures &&
        item.enclosures.length === 1 &&
        item.enclosures[0].type === 'application/json') {
          doItem(smoker, item)
      } else {
        feedparser.emit('error', new Error(`Bad enclosures with ${item.link}.`))
      }
    }
  })
}

module.exports = (feedurl) => {
  const smoker = new Smoker()
  doPage(smoker, feedurl, true)
  return smoker
}
