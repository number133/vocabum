import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Collections } from '../../../api/collections/collections.js';
import { Words } from '../../../api/words/words.js';
import { Sentences } from '../../../api/sentences/sentences.js';

import './collections-show-page.html';

Template.Collections_show_page.onCreated( function() {
  this.templateDictionary = new ReactiveDict();
  this.templateDictionary.set('selectedCollection', null);
  this.templateDictionary.set('selectedWord', null);
});

Template.Collections_show_page.helpers({
  listCollectionsSettings: function () {
    return {
      collection: Collections.find({}),
      rowsPerPage: 10,
      showFilter: false,
      class: 'table table-hover col-sm-12 voc-selectable-table js-collections',
      rowClass: 'clickable-row',
      fields: [
        {
          fieldId: 'name',
          key: 'name',
          label: 'Name'
        },
        {
          fieldId: 'action',
          key: '_id',
          label: '',
          fn: function (value) { return 'X'; }
        }
      ]
    };
  },
  listCollectionWordsSettings: function () {
    var ids = [];
    var collection = Template.instance().templateDictionary.get('selectedCollection');
    if(collection){
      var words = collection.words;
      for (var i = 0; i < words.length; i++) {
          ids.push(words[i].wordId);
      }
    }
    return {
      collection: Words.find({_id: {$in: ids}}),
      rowsPerPage: 10,
      showFilter: false,
      class: 'table table-hover col-sm-12 voc-selectable-table js-words',
      fields:
      [
        {
          fieldId: 'data.eng',
          key: 'data.eng',
          label: 'Name'
        },
        {
          fieldId: 'action',
          key: '_id',
          label: '',
          fn: function (value) { return 'X'; }
        }
      ]
    };
  },
  listWordSentencesSettings: function () {
    var ids = [];
    var collection = Template.instance().templateDictionary.get('selectedCollection');
    var word = Template.instance().templateDictionary.get('selectedWord');
    if(word && collection){
      for(var i=0; i<collection.words.length; i++){
        if(collection.words[i].wordId == word._id){
          ids = collection.words[i].sentenceIds;
          break;
        }
      }
    }
    return {
      collection: Sentences.find({_id: {$in: ids}}),
      rowsPerPage: 10,
      showFilter: false,
      class: 'table table-hover col-sm-12 voc-selectable-table js-sentences',
      fields:
      [
        {
          fieldId: 'data.eng',
          key: 'data.eng',
          label: 'Name english'
        },
        {
          fieldId: 'data.rus',
          key: 'data.rus',
          label: 'Name russian'
        },
        {
          fieldId: 'action',
          key: '_id',
          label: '',
          fn: function (value) { return 'X'; }
        }
      ]
    };
  },
  collectionSelected: function () {
    return Template.instance().templateDictionary.get('selectedCollection') != null;
  },
  wordSelected: function () {
    return Template.instance().templateDictionary.get('selectedWord') != null;
  },
  selectedCollection: function () {
    return Template.instance().templateDictionary.get('selectedCollection');
  },
  selectedWord: function () {
    return Template.instance().templateDictionary.get('selectedWord');
  }
});

Template.Collections_show_page.events({
  'submit .new-collection'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form element
    const target = event.target;
    const textName = target.name.value;

    // Insert a word into the collection
    Collections.insert({
      createdAt: new Date(),
      name: textName,
    });

    // Clear form
    target.name.value = '';
  },
  'click .reactive-table tbody tr': function (event) {
    $(event.target.parentElement).addClass('bg-info').siblings().removeClass('bg-info');
  },

  'click .reactive-table.js-collections tbody tr': function (event) {
    if(event.target.className === 'name') {
      Template.instance().templateDictionary.set('selectedCollection', this);
      Template.instance().templateDictionary.set('selectedWord', null);
    }
    if(event.target.className === '_id') {
      Collections.remove({_id: this._id});
    }
  },

  'click .js-collection-add-word': function(e) {
    e.preventDefault();
    $('#wordsModal').modal('show');
  },

  'click .reactive-table.js-words tbody tr': function (event) {
    if(event.target.className === 'data.eng') {
      Template.instance().templateDictionary.set('selectedWord', this);
    }
    if(event.target.className === '_id') {
      var collection = Template.instance().templateDictionary.get('selectedCollection');
      var wordsNew = collection.words;
      var i = wordsNew.length;
      while (i--) {
        if(wordsNew[i].wordId == this._id) {
          wordsNew.splice(i, 1);
          break;
        }
      }
      Collections.update(collection._id, { $set: { words: wordsNew } });
    }
  },

  'click .js-word-add-sentence': function(e) {
    e.preventDefault();
    $('#sentencesModal').modal('show');
  },

  'click .reactive-table.js-sentences tbody tr': function (event) {
    if(event.target.className === '_id') {
      var collection = Template.instance().templateDictionary.get('selectedCollection');
      var word = Template.instance().templateDictionary.get('selectedWord');
      if(word && collection){
        var i = collection.words.length;
        var wordsNew = collection.words;
        while (i--) {
          if(wordsNew[i].wordId == word._id){
            wordsNew[i].sentenceIds.splice(i, 1);
            break;
          }
        }
      }
      Collections.update(collection._id, { $set: { words: wordsNew } });
    }
  },
});

// words modal template
Template.wordsModalTemplate.onCreated( function() {
  this.templateDictionary = new ReactiveDict();
  this.templateDictionary.set('selectedWord', null);
});

Template.wordsModalTemplate.helpers({
  listAllWordsSettings: function () {
    return {
      collection: Words.find({}),
      rowsPerPage: 10,
      showFilter: true,
      class: 'table table-hover col-sm-12',
      fields: ['data.eng']
    };
  },
  wordSelected: function () {
    return Template.instance().templateDictionary.get('selectedWord') != null;
  }
});

Template.wordsModalTemplate.events({
  'click .reactive-table tbody tr': function (event) {
    Template.instance().templateDictionary.set('selectedWord', this);
  },
  'click #save': function(e) {
    e.preventDefault();

    var collection = Template.currentData().collection;
    var wordsNew = collection.words;
    wordsNew.push({
      wordId: Template.instance().templateDictionary.get('selectedWord')._id,
      sentenceIds: []
    });
    Collections.update(collection._id, { $set: { words: wordsNew } });
    $('#wordsModal').modal('hide');
  }
});

// sentences modal template
Template.sentencesModalTemplate.onCreated( function() {
  this.templateDictionary = new ReactiveDict();
  this.templateDictionary.set('selectedSentence', null);
});

Template.sentencesModalTemplate.helpers({
  listAllSentencesSettings: function () {
    return {
      collection: Sentences.find({}),
      rowsPerPage: 10,
      showFilter: true,
      class: 'table table-hover col-sm-12',
      fields: ['data.eng', 'data.rus']
    };
  },
  sentenceSelected: function () {
    return Template.instance().templateDictionary.get('selectedSentence') != null;
  }
});

Template.sentencesModalTemplate.events({
  'click .reactive-table tbody tr': function (event) {
    Template.instance().templateDictionary.set('selectedSentence', this);
  },
  'click #save': function(e) {
    e.preventDefault();

    var collection = Template.currentData().collection;
    var word = Template.currentData().word;
    var sentenceId = Template.instance().templateDictionary.get('selectedSentence')._id;
    var wordsNew = collection.words;
    for(var i=0; i<wordsNew.length; i++){
      if(wordsNew[i].wordId == word._id){
          wordsNew[i].sentenceIds.push(sentenceId);
      }
    }
    Collections.update(collection._id, { $set: { words: wordsNew } });
    $('#sentencesModal').modal('hide');
  }
});