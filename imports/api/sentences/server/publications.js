import { Meteor } from 'meteor/meteor';
import { Sentences } from '../sentences.js';

Meteor.publish('sentences.all', function() {
  return Sentences.find({});
});