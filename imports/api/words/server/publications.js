import { Meteor } from 'meteor/meteor';
import { Words } from '../words.js';

Meteor.publish('words.all', function() {
  return Words.find({});
});

Meteor.publish('words.practice', function(idList) {
  return Words.find({ _id: { $in: idList } });
});