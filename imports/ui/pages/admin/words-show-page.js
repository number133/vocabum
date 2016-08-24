import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Words } from '../../../api/words/words.js';

import './words-show-page.html';

Template.Words_show_page.helpers({
  listWords() {
    return Words.find({});
  }
});

Template.Words_show_page.events({
  'submit .new-word'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form element
    const target = event.target;
    const textEnglish = target.eng.value;
    const textRussian = target.rus.value;

    // Insert a word into the collection
    Words.insert({
      createdAt: new Date(),
      data: {
        eng: textEnglish,
        rus: textRussian
      },
    });

    // Clear form
    target.eng.value = '';
    target.rus.value = '';
  },
});