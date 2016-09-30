import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Collections } from '../../../api/collections/collections.js';
import { Words } from '../../../api/words/words.js';
import { Sentences } from '../../../api/sentences/sentences.js';
import { Utils } from '../../../api/utils.js';

import './play-page.html';

Template.Play_page.onCreated( function() {
  this.templateDictionary = new ReactiveDict();
  this.templateDictionary.set('currentWord', null);
  this.templateDictionary.set('currentWordIndex', null);
  this.templateDictionary.set('currentCollection', null);
  this.templateDictionary.set('currentSentences', []);
  this.templateDictionary.set('currentAnswers', []);
  this.templateDictionary.set('currentResult', "");
  this.templateDictionary.set('showTip', false);
});

Template.Play_page.helpers({
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
  },
  answers() {
  	return Template.instance().templateDictionary.get('currentAnswers');
  },
  result(){
  	return Template.instance().templateDictionary.get('currentResult');
  },
  showTip(){
  	return  Template.instance().templateDictionary.get('showTip');
  }
});

Template.Play_page.events({
    "change #collection-select": function (event, template) {
        var collectionId = $(event.currentTarget).val();
        console.log("collectionId : " + collectionId);
        var collection = Collections.findOne({_id: collectionId});
        Template.instance().templateDictionary.set('currentCollection', collection);
        if(collection.words.length > 0) {
          var wordId = collection.words[0].wordId;
          Template.instance().templateDictionary.set('currentWordIndex', 0);
          Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: wordId}));
          var answers = [];
          answers.push(Words.findOne({_id: wordId}));
          answers = answers.concat(Words.find({_id: { $ne: wordId}}, { limit: 4}).fetch());
          Utils.shuffle(answers);
          Template.instance().templateDictionary.set('currentAnswers', answers);
          Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: collection.words[0].sentenceIds}}).fetch());
        }
        // additional code to do what you want with the category
    },

    "click .js-next-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      if(collection.words.length > cIndex + 1){
        Template.instance().templateDictionary.set('currentWordIndex', cIndex + 1);
        var word = Words.findOne({_id: collection.words[cIndex + 1].wordId});
        Template.instance().templateDictionary.set('currentWord', word);
        var answers = [];
        answers.push(word);
        answers = answers.concat(Words.find({_id: { $ne: word._id}}, { limit: 4}).fetch());
        Utils.shuffle(answers);
        Template.instance().templateDictionary.set('currentAnswers', answers);
        Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: collection.words[cIndex + 1].sentenceIds}}).fetch());
      	Template.instance().templateDictionary.set('currentResult', "");
      	Template.instance().templateDictionary.set('showTip', false);
      }
    },

    "click .js-first-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      Template.instance().templateDictionary.set('currentWordIndex', 0);
      var word = Words.findOne({_id: collection.words[0].wordId});
      Template.instance().templateDictionary.set('currentWord', word);
      var answers = [];
      answers.push(word);
      answers = answers.concat(Words.find({_id: { $ne: word._id}}, { limit: 4}).fetch());
      Utils.shuffle(answers);
      Template.instance().templateDictionary.set('currentAnswers', answers);
      Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: collection.words[0].sentenceIds}}).fetch());
    	Template.instance().templateDictionary.set('currentResult', "");
    	Template.instance().templateDictionary.set('showTip', false);
    },

    "click .js-answer": function (event) {
    	var word = Template.instance().templateDictionary.get('currentWord');
      	if(event.target.outerText == word.data.secondLang){
      		Template.instance().templateDictionary.set('currentResult', "true");
      	} else {
      		Template.instance().templateDictionary.set('currentResult', "false");
      	}
    },

    "click .js-tip": function (event) {
    	Template.instance().templateDictionary.set('showTip', true);
    }
});