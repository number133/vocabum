import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Collections } from '../../../api/collections/collections.js';
import { Words } from '../../../api/words/words.js';
import { Sentences } from '../../../api/sentences/sentences.js';
import { UserWords } from '../../../api/user/user_words.js';
import { Utils } from '../../../api/utils.js';

import './play-page.html';

Template.Play_page.onCreated( function() {
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
  this.templateDictionary.set('currentCollection', null);
  this.templateDictionary.set('currentWordIndex', null);
  this.templateDictionary.set('currentWordsToReview', []);
  this.templateDictionary.set('currentSentences', []);
  this.templateDictionary.set('currentAnswers', []);
  this.templateDictionary.set('currentResult', "");
  this.templateDictionary.set('showTip', false);
  this.templateDictionary.set('wordStatus', "");
});

Template.Play_page.helpers({
  collections() {
    return Collections.find({});
  },
  wordCount() {
    var collection = Template.instance().templateDictionary.get('currentCollection');
    return collection ? UserWords.find({collectionId: collection._id}).count() : '';
  },
  word() {
    return Template.instance().templateDictionary.get('currentWord');
  },
  hasNextWord() {
    return Template.instance().templateDictionary.get('currentWordsToReview').length > Template.instance().templateDictionary.get('currentWordIndex') + 1;
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
  },
  progressValue() {
    var size = Template.instance().templateDictionary.get('currentCollectionSize');
    var orderNumber = Template.instance().templateDictionary.get('currentWordIndex') + 1;
    return Math.round((orderNumber/size)*100);
  },
  answeredClass(){
    return Template.instance().templateDictionary.get('currentResult') != '' ? 'disabledbutton' : '';
  },
  notAnsweredClass(){
    return Template.instance().templateDictionary.get('currentResult') == '' ? 'disabledbutton' : '';
  },
  wordStatus(){
    return Template.instance().templateDictionary.get('wordStatus');
  }
});

var generateAnswers = function (wordId) { 
  var answers = [];
  var allWords = Words.find({}).fetch();
  answers.push(Words.findOne({_id: wordId}));
  while(answers.length < 5){
    var candidate = allWords[Math.floor((Math.random() * allWords.length))];
    if($.grep(answers, function(item){ return item._id == candidate._id}).length == 0){
      answers.push(candidate);
    }
  }
  Utils.shuffle(answers); 
  return answers;
};

Template.Play_page.events({
    "change #collection-select": function (event, template) {
        var collectionId = $(event.currentTarget).val();
        console.log("collectionId : " + collectionId);
        console.log(UserWords.find({}).fetch()[0]);
        var collection = Collections.findOne({_id: collectionId});
        var wordsToReview = UserWords.find({
          collectionId: collectionId          
        }, 
        { 
          limit: 10 
        }).fetch();
        Template.instance().templateDictionary.set('currentCollection', collection);
        Template.instance().templateDictionary.set('currentWordsToReview', wordsToReview);
        if(wordsToReview.length > 0) {
          var wordId = wordsToReview[0].wordId;
          Template.instance().templateDictionary.set('currentCollectionSize', wordsToReview.length);
          Template.instance().templateDictionary.set('currentWordIndex', 0);
          Template.instance().templateDictionary.set('currentWord', Words.findOne({_id: wordId}));
          var answers = generateAnswers(wordId);
          Template.instance().templateDictionary.set('currentAnswers', answers);
          var wordInCollection = $.grep(collection.words, function(n, i){
            return n.wordId == wordId;
          });
          Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: wordInCollection[0].sentenceIds}}).fetch());
          Template.instance().templateDictionary.set('wordStatus', (wordsToReview[0].bucket - 1)*20 + '%');
        }
        // additional code to do what you want with the category
    },

    "click .js-next-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      var wordsToReview = Template.instance().templateDictionary.get('currentWordsToReview');
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      if(wordsToReview.length > cIndex + 1){
        Template.instance().templateDictionary.set('currentWordIndex', cIndex + 1);
        var word = Words.findOne({_id: wordsToReview[cIndex + 1].wordId});
        Template.instance().templateDictionary.set('currentWord', word);
        var answers = generateAnswers(word._id);
        Template.instance().templateDictionary.set('currentAnswers', answers);
        var wordInCollection = $.grep(collection.words, function(n, i){
            return n.wordId == word._id;
          });
        Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: wordInCollection[0].sentenceIds}}).fetch());
      	Template.instance().templateDictionary.set('currentResult', "");
      	Template.instance().templateDictionary.set('showTip', false);
        Template.instance().templateDictionary.set('wordStatus', (wordsToReview[cIndex + 1].bucket - 1)*20 + '%');
      }
    },

    "click .js-first-word": function (event) {
      var collection = Template.instance().templateDictionary.get('currentCollection');
      var wordsToReview = UserWords.find({
          collectionId: collection._id          
        }, 
        { 
          limit: 10 
        }).fetch();
      Template.instance().templateDictionary.set('currentWordsToReview', wordsToReview);
      Template.instance().templateDictionary.set('currentWordIndex', 0);
      var word = Words.findOne({_id: wordsToReview[0].wordId});
      Template.instance().templateDictionary.set('currentWord', word);
      var answers = generateAnswers(word._id);
      Template.instance().templateDictionary.set('currentAnswers', answers);
      var wordInCollection = $.grep(collection.words, function(n, i){
        return n.wordId == word._id;
      });
      Template.instance().templateDictionary.set('currentSentences', Sentences.find({_id: {$in: wordInCollection[0].sentenceIds}}).fetch());
    	Template.instance().templateDictionary.set('currentResult', "");
    	Template.instance().templateDictionary.set('showTip', false);
    },

    "click .js-answer": function (event) {
    	var word = Template.instance().templateDictionary.get('currentWord');
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      var wordsToReview = Template.instance().templateDictionary.get('currentWordsToReview');
      var reviewWord = wordsToReview[cIndex];
      	if(event.target.outerText == word.data.secondLang){
      		Template.instance().templateDictionary.set('currentResult', "true");
          Template.instance().templateDictionary.set('showTip', true);
          var newBucket = reviewWord.bucket < 6 ? reviewWord.bucket + 1 : 6;
          UserWords.update({_id : reviewWord._id}, {$set: {lastDate: new Date(), bucket: newBucket}});
          Template.instance().templateDictionary.set('wordStatus', (newBucket - 1)*20 + '%');
      	} else {
      		Template.instance().templateDictionary.set('currentResult', "false");
          UserWords.update({_id : reviewWord._id}, {$set: {lastDate: new Date(), bucket: 1}});
      	  Template.instance().templateDictionary.set('wordStatus', '0%');
        }
    },

    "click .js-tip": function (event) {
    	Template.instance().templateDictionary.set('showTip', true);
      var cIndex = Template.instance().templateDictionary.get('currentWordIndex');
      var wordsToReview = Template.instance().templateDictionary.get('currentWordsToReview');
      var reviewWord = wordsToReview[cIndex];
      var newBucket = reviewWord.bucket > 1 ? reviewWord.bucket - 1 : 1;
      UserWords.update({_id : reviewWord._id}, {$set: {lastDate: new Date(), bucket: newBucket}});
    }
});