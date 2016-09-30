import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Words } from '../../../api/words/words.js';

import './words-show-page.html';

Template.Words_show_page.helpers({
  listWords() {
    debugger;
    return Words.find({});
  }
});

Template.Words_show_page.events({
  'submit .new-word'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form element
    const target = event.target;
    const textFirstLang = target.first_lang.value;
    const textSecondLang = target.second_lang.value;

    // Insert a word into the collection
    Words.insert({
      createdAt: new Date(),
      data: {
        firstLang: textFirstLang,
        secondLang: textSecondLang
      },
    });

    // Clear form
    target.first_lang.value = '';
    target.second_lang.value = '';
  },
});