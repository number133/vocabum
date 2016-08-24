import { Meteor } from 'meteor/meteor';

import { Words } from '../imports/api/words/words.js';

Meteor.startup(() => {
  // code to run on server at startup
  if (Words.find().count() === 0) {
    JSON.parse(Assets.getText("words.json")).words.forEach(function (doc) {
      Words.insert(doc);
    });
  }
});
