var fbtemplates = {};

fbtemplates.genericTemplate = function(elements) {
  return generic_res = {
    'attachment': {
      'type': "template",
      'payload': {
        'template_type': "generic",
        'elements': elements
      }
    }
  }
}

fbtemplates.elementsList = function(tracks, artists) {
  var res = [];
  if (!tracks) return res;
  var maxTracks = 10;
  if (artists && artists.length) maxTracks = 7; // Space for artist cards
  for (var i = 0; i < tracks.length && i < maxTracks; i++) {
    if (tracks[i].type === 'track') {
      res.push(this._trackElement(tracks[i]));
    }
  }
  if (!artists) return res;
  for (var i = 0; i < artists.length && res.length < 10; i++) {
    if (artists[i].type === 'artist') {
      // console.log(artists[i])
      res.push(this._artistElement(artists[i]));
    }
  }
  return res;
}

fbtemplates.trackElementsList = function(tracks) {
  var res = [];
  if (!tracks) return res;
  // console.log(tracks);
  for (var i = 0; i < tracks.length && i < 9; i++) {
    if (tracks[i].type !== 'track') continue;
    // console.log(tracks[i]);
    res.push(this._trackElement(tracks[i]));
  }
  return res;
}

fbtemplates._trackElement = function(track) {
  return {
    'title': track.name,
    'buttons': [{
      'type': 'postback',
      'title': 'Listen',
      'payload': JSON.stringify(this._trackPostback(track.preview_url))}
    ],
    'subtitle': track.artists[0].name
  }
}

fbtemplates._trackPostback = function(preview_url) {
  return {'entity': 'track', 'preview_url': preview_url}
}

fbtemplates.trackPreview = function(audio_url) {
  return {
    'attachment': {
      'type': 'audio',
      'payload': {'url': audio_url}}
    }
}

fbtemplates._artistElement = function(artist) {
  element = {
    'title': artist.name,
    'subtitle': 'Artist',
    'buttons': [{
      'type': 'postback',
      'title': 'Tell me more',
      'payload': JSON.stringify(this._artistPostback(artist.id))}
    ]
  }
  if ('images' in artist && artist.images.length) {
    element['image_url'] = artist.images[0].url;
  }
  return element;
}

fbtemplates._artistPostback = function(spotify_id) {
  return {'entity': 'artist', 'spotify_id': spotify_id}
}

module.exports = fbtemplates;
