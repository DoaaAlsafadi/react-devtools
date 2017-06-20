/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const Application = require('./source/Application');
const {deserialize, serialize} = require('../../frontend/Themes/Serializer');
const Themes = require('../../frontend/Themes/Themes');

const {location} = window;

let theme;

function updateTheme(updatedTheme) {
  const serialized = encodeURI(serialize(updatedTheme));

  if (history.pushState) {
    const url = `${location.protocol}//${location.host}${location.pathname}?theme=${serialized}`;

    window.history.pushState({path: url}, '', url);
  }
}

function parseTheme() {
  const match = location.href.match(/theme=(.+)/);
  if (!match) {
    throw Error('Missing or invalid theme specified');
  }

  const serializedTheme = decodeURI(match[1]);

  theme = deserialize(serializedTheme, Themes.ChromeDefault);
}

function renderApplication() {
  ReactDOM.render(
    <Application
      theme={theme}
      updateTheme={updateTheme}
    />,
    document.getElementById('application')
  );
}

window.addEventListener('popstate', () => {
  parseTheme();
  renderApplication();
});

parseTheme();
renderApplication();