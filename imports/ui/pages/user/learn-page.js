import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Collections } from '../../../api/collections/collections.js';
import { Words } from '../../../api/words/words.js';
import { Sentences } from '../../../api/sentences/sentences.js';

import './learn-page.html';

Template.Learn_page.onCreated( function() {
  this.templateDictionary = new ReactiveDict();
  this.templateDictionary.set('currentWord', null);
  this.templateDictionary.set('currentWordIndex', null);
  this.templateDictionary.set('currentCollection', null);
  this.templateDictionary.set('currentSentences', []);
});

Template.Learn_page.helpers({
  collections() {
    return Collections.find({});
  },
  word() {
    return Template.instance().templateDictionary.get('currentWord');
  },
  hasNextWord() {
    return Template.instance().templateDictionary.get('currentCollection').words.length > Template.instance().templateDictionary.get('currentWordIndex') + 1;
  },
  sentences() {
    return Template.instance().templateDictionary.get('currentSentences');
  }
});

Template.Learn_page.events({
    "change #collection-select": function (event, template) {
        var collectionId = $(event.currentTarget).val();
        console.log("collectionId : " + collectionId);
        var collection = Collections.findOne({_id: collectionId});
        Template.instance().templateDictionary.set('currentCollection', collection);
        if(collection.words.length > 0) {
          var wordId = collection.words[0].wordId;
          Template.instance().templateDictionary.set('currentWordIndex', 0);
          Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: wordId}));
          Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: collection.words[0].sentenceIds}}).fetch());
        }
        // additional code to do what you want with the category
    },

    "click .js-next-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      if(collection.words.length > cIndex + 1){
        Template.instance().templateDictionary.set('currentWordIndex', cIndex + 1);
        Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: collection.words[cIndex + 1].wordId}));
        Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: collection.words[cIndex + 1].sentenceIds}}).fetch());
      }
    },

    "click .js-first-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      Template.instance().templateDictionary.set('currentWordIndex', 0);
      Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: collection.words[0].wordId}));
      Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: collection.words[0].sentenceIds}}).fetch());
    }
});