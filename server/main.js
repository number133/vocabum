import { Meteor } from 'meteor/meteor';

import { Words } from '../imports/api/words/words.js';
import { Sentences } from '../imports/api/sentences/sentences.js';
import { Collections } from '../imports/api/collections/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
  if (Words.find().count() === 0) {
    JSON.parse(Assets.getText("words.json")).words.forEach(function (doc) {
      Words.insert(doc);
    });
  }
});
