import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Collections } from '../../../api/collections/collections.js';
import { Words } from '../../../api/words/words.js';
import { Sentences } from '../../../api/sentences/sentences.js';
import { UserWords } from '../../../api/user/user_words.js';

import './learn-page.html';

Template.Learn_page.onCreated( function() {
  this.autorun(() => {
    this.subscribe('words.all');
  });
  this.autorun(() => {
    this.subscribe('sentences.all');
  });
  this.autorun(() => {
    this.subscribe('collections.all');
  });
  this.autorun(() => {
    this.subscribe('user_words.all');
  });

  this.templateDictionary = new ReactiveDict();
  this.templateDictionary.set('currentWord', null);
  this.templateDictionary.set('currentWordIndex', null);
  this.templateDictionary.set('currentCollection', null);
  this.templateDictionary.set('currentWordsToLearn', []);
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
    return Template.instance().templateDictionary.get('currentWordsToLearn').length > Template.instance().templateDictionary.get('currentWordIndex') + 1;
  },
  sentences() {
    return Template.instance().templateDictionary.get('currentSentences');
  },
  progressValue() {
    var size = Template.instance().templateDictionary.get('currentCollectionSize');
    var orderNumber = Template.instance().templateDictionary.get('currentWordIndex') + 1;
    return Math.round((orderNumber/size)*100);
  }
});

Template.Learn_page.events({
    "change #collection-select": function (event, template) {
      $('#start-button').show();
    },

    "click .js-start": function (event, template) {
      var collectionId = $('#collection-select').val();
        var collection = Collections.findOne({_id: collectionId});
        Template.instance().templateDictionary.set('currentCollection', collection);
        var learnedWords = UserWords.find({collectionId: collectionId}).fetch();
        var learnedWordIdList = jQuery.map(learnedWords, function(word) {
          return word.wordId;
        });
        var currentWordsToLearn = jQuery.map(collection.words, function(word) {
          return $.inArray(word.wordId, learnedWordIdList) > -1 ? null : word;
        });
        currentWordsToLearn = currentWordsToLearn.slice(0, 10);
        Template.instance().templateDictionary.set('currentWordsToLearn', currentWordsToLearn);
        if(currentWordsToLearn.length > 0) {
          var wordId = currentWordsToLearn[0].wordId;
          Template.instance().templateDictionary.set('currentCollectionSize', currentWordsToLearn.length);
          Template.instance().templateDictionary.set('currentWordIndex', 0);
          Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: wordId}));
          var userWord = UserWords.findOne({collectionId: collectionId, wordId: wordId});
          if(!userWord){
            UserWords.insert({
              createdAt: new Date(),
              collectionId: collectionId,
              wordId: wordId,
              userEmail: Meteor.user().emails[0].address,
              lastDate: new Date(),
              bucket: 1
            });
          }
          Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: currentWordsToLearn[0].sentenceIds}}).fetch());
          $('#practice-region').show();
          $('#main-region').hide();
        }
    },

    "click .js-next-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      var currentWordsToLearn = Template.instance().templateDictionary.get('currentWordsToLearn');
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      if(currentWordsToLearn.length > cIndex + 1){
        Template.instance().templateDictionary.set('currentWordIndex', cIndex + 1);
        Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: currentWordsToLearn[cIndex + 1].wordId}));
        var userWord = UserWords.findOne({collectionId: collection._id, wordId: currentWordsToLearn[cIndex + 1].wordId});
          if(!userWord){
            UserWords.insert({
              createdAt: new Date(),
              collectionId: collection._id,
              wordId: currentWordsToLearn[cIndex + 1].wordId,
              userEmail: Meteor.user().emails[0].address,
              lastDate: new Date(),
              bucket: 1
            });
          }
        Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: currentWordsToLearn[cIndex + 1].sentenceIds}}).fetch());
      }
    },

    "click .js-last-word": function (event) {
      $('#practice-region').hide();
      $('#main-region').show();
      Template.instance().templateDictionary.set('currentWord', null);
      Template.instance().templateDictionary.set('currentWordIndex', null);
      Template.instance().templateDictionary.set('currentCollection', null);
      Template.instance().templateDictionary.set('currentWordsToLearn', []);
      Template.instance().templateDictionary.set('currentSentences', []);
    },

    "click .js-mark-ignore": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      var currentWordsToLearn = Template.instance().templateDictionary.get('currentWordsToLearn');
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      var userWord = UserWords.findOne({collectionId: collection._id, wordId: currentWordsToLearn[cIndex].wordId});
      UserWords.update({_id : userWord._id}, {$set: {lastDate: new Date(), bucket: 6}});  
    }
});