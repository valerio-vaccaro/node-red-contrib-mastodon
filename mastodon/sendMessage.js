/**
 * sendMessage.js
 * Requires mastodon
 * Copyright 2018 Valerio Vaccaro - www.valeriovaccaro.it
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  var Masto = require('mastodon')

  function sendMessage(n) {
    RED.nodes.createNode(this, n);

    var msg = {};
    var access_token;
    var timeout_ms;
    var api_url;
    var node = this;

    // Get varables from the node
    this.access_token = n.access_token;
    this.timeout_ms = n.timeout_ms;
    this.api_url = n.api_url;

    var M = new Masto({
      access_token: access_token,
      timeout_ms: timeout_ms, // optional HTTP request timeout to apply to all requests.
      api_url: api_url, // optional, defaults to https://mastodon.social/api/v1/
    })

    // Status icon
    this.status({
      fill: "grey",
      shape: "dot",
      text: "Waiting"
    });

    this.on("input", function(msg) {
      /*var id;
      M.post('media', { file: fs.createReadStream('path/to/image.png') }).then(resp => {
        id = resp.data.id;
        M.post('statuses', { status: '#selfie', media_ids: [id] })
      })*/
      try {
        M.post('statuses', {
          status: msg.payload
        });
        this.status({
          fill: "green",
          shape: "dot",
          text: "sent: " + msg.payload
        });
      } catch (err) {
        console.log(err);
      }
    });

    this.on("close", function() {
      try {
        this.status({
          fill: "red",
          shape: "dot",
          text: "Stopped"
        });
      } catch (err) {
        console.log(err);
      }
    });
  }

  // Register the node by name. This must be called before overriding any of the
  // Node functions.
  RED.nodes.registerType("sendMessage", sendMessage);
}
