import { Meteor } from 'meteor/meteor';
import { Words } from '../words.js';

Meteor.publish('words.all', function() {
  return Words.find({});
});