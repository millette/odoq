#!/usr/bin/env node

/*
Observatoire des données ouvertes du Québec.

Copyright 2016
Robin Millette <robin@millette.info>
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

// npm
const meow = require('meow')
const updateNotifier = require('update-notifier')
const got = require('got')

// self
const odoq = require('./')

updateNotifier({ pkg: require('./package.json') }).notify()

// https://www.donneesquebec.ca/recherche/fr/feeds/dataset.atom
// https://www.donneesquebec.ca/recherche/fr/feeds/dataset.atom?page=1

const ATOM_DATASET = 'https://www.donneesquebec.ca/recherche/fr/feeds/dataset.atom'

const cli = meow([
  'Usage',
  '  $ odoq [input]',
  '',
  'Options',
  '  --foo  Lorem ipsum. [Default: false]',
  '',
  'Examples',
  '  $ odoq',
  '  unicorns & rainbows',
  '  $ odoq ponies',
  '  ponies & rainbows'
])

/*
odoq(cli.input[0] || ATOM_DATASET)
  .then((response) => {
    console.log(response)
    // console.log(response.headers)
    // console.log(response.body)
  })
  .catch(console.error)
*/

const zaz = odoq(cli.input[0] || ATOM_DATASET)

zaz.on('error', (error) => { console.error('CLI ERROR', error) })

zaz.on('meta', (meta) => {
  // console.log('META', JSON.stringify(meta, null, '  '))
  meta._id = meta.xmlUrl
  meta.fetchedAt = new Date().toISOString()
  console.log('META', meta.fetchedAt, meta._id)
  got('http://localhost:5993/odoq', {
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(meta)
  })
    .then((res) => {
      console.log('Pushed', res.body)
    })
    .catch(console.error)
})

zaz.on('item', (item) => {
  // console.log('ITEM', JSON.stringify(item, null, '  '))
  item._id = item.enclosureJson.id
  item.fetchedAt = new Date().toISOString()
  console.log('ITEM', item.fetchedAt, item._id)
  got('http://localhost:5993/odoq', {
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then((res) => {
      console.log('Pushed', res.body)
    })
    .catch(console.error)
})
