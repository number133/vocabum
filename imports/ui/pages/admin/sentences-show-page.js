import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Sentences } from '../../../api/sentences/sentences.js';

import './sentences-show-page.html';

Template.Sentences_show_page.helpers({
  listSentences() {
    return Sentences.find({});
  }
});

Template.Sentences_show_page.events({
  'submit .new-sentence'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form element
    const target = event.target;
    const sentenceFirstLang = target.firstLang.value;
    const sentenceSecondLang = target.secondLang.value;

    // Insert a sentence into the collection
    Sentences.insert({
      createdAt: new Date(),
      data: {
        firstLang: sentenceFirstLang,
        secondLang: sentenceSecondLang
      },
    });

    // Clear form
    target.firstLang.value = '';
    target.secondLang.value = '';
  },
  // 'click .edit-sentence'(event) {
  //   // Get values from form element
  //   const target = event.target;
  //   const sentenceEnglish = target.eng.value;
  //   const sentenceRussian = target.rus.value;

  //   // Insert a sentence into the collection
  //   Sentences.insert({
  //     createdAt: new Date(),
  //     data: {
  //       eng: sentenceEnglish,
  //       rus: sentenceRussian
  //     },
  //   });

  //   // Clear form
  //   target.eng.value = '';
  //   target.rus.value = '';
  // },
});