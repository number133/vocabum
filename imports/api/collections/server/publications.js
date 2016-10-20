import { Meteor } from 'meteor/meteor';
import { Collections } from '../collections.js';

Meteor.publish('collections.all', function() {
  return Collections.find({});
});