const Bot = require('messenger-bot');
const SpotifyWebApi = require('spotify-web-api-node');
const fbtemplates = require('./fbtemplates');
const async = require('async');

var spotifyApi = new SpotifyWebApi();

let bot = new Bot({
  token: 'EAAW1sxKc21YBACKrutasaWZCayE63SNOh3ndjuooA2ijmyi4S9bJkZAfIgLswDgoyDqKVNddlZCogl4466XAWsmOlMx5AhM3M5oXiS5YDIZAIW6ZBmZCXccZCe7YciDFUQhMM9s5bzwleZCEB9biVr4uZBccaGvZAlrdMXeHT8C4qe7wZDZD',
  verify: 'a',
  app_secret: 'APP_SECRET'
})

bot.on('message', (payload, reply) => {
  // console.log(payload);
  async.waterfall([
    function(callback) {
      bot.getProfile(payload.sender.id, callback);
    },
    function(profile, callback) {
      spotifyGenericQuery(payload.message.text, callback);
    },
    function(payload, callback) {
      reply(payload, callback);
    }],
    function(err) {
      if (err) return console.log(err);
    }
  );
});

bot.on('postback', (payload, reply) => {
  console.log(payload);
  async.waterfall([
    function(callback) {
      bot.getProfile(payload.sender.id, callback);
    },
    function(profile, callback) {
      handlePostbacks(payload, callback);
    },
    function(payload, callback) {
      console.log(payload);
      reply(payload, callback);
    }],
    function(err) {
      if (err) return console.log(err);
    });
});

bot.on('error', (err) => {
  console.log(err.message)
});

function handlePostbacks(payload, callback) {
  // console.log(payload);
  metadata = JSON.parse(payload.postback.payload);
  if (metadata.entity === 'track') {
    callback(null, fbtemplates.trackPreview(metadata.preview_url));
  } else if (metadata.entity === 'artist') {
    spotifyApi.getArtistTopTracks(metadata.spotify_id, 'US', function(err, data) {
      if (err) return callback(err);
      console.log(data);
      var payload = fbtemplates.genericTemplate(fbtemplates.elementsList(
        data.body.tracks, null));
      callback(null, payload);
    });
  }
}

function spotifyGenericQuery(query, cb) {
  async.waterfall([
    function(callback) {
      spotifyApi.search(query, ['track', 'artist'], {limit: 10}, callback);
    },
    function(data, callback) {
      var payload = fbtemplates.genericTemplate(fbtemplates.elementsList(
        data.body.tracks.items, data.body.artists.items));
      cb(null, payload);
    }],
    function(err, payload) {
      if (err) return cb(err);
    }
  );
}

module.exports = bot;
