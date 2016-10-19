import { Meteor } from 'meteor/meteor';

import { Words } from '../imports/api/words/words.js';
import { Sentences } from '../imports/api/sentences/sentences.js';
import { Collections } from '../imports/api/collections/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
  // if (Words.find().count() === 0) {
  //   JSON.parse(Assets.getText("words.json")).words.forEach(function (doc) {
  //     Words.insert(doc);
  //   });
  // }
  Words.remove({});
  Sentences.remove({});
  Collections.remove({});

  console.log('Filling test data start');
  var lines = Assets.getText("turkish.txt");
  lines = lines.split('\n');
  var i;
  var wordsInCollection = [];
  for (i = 0; i < lines.length; i++) { 
    var tabs = lines[i].split('\t');
    var wordFirst = tabs[1].trim();
    var wordSecond = tabs[4].trim();
    var sentenceFirst = tabs[5].trim();
    var sentenceSecond = tabs[6].trim();
    // console.log(wordFirst + ' - ' + wordSecond + ' - ' + sentenceFirst + ' - ' + sentenceSecond);
    var wordId = Words.insert({ 
    	createdAt: new Date(),
    	data: { 
    		firstLang: wordFirst, 
    		secondLang: wordSecond 
    	} 
    });
    
    if(sentenceFirst && sentenceSecond){
    	var sentenceId = Sentences.insert({
	      createdAt: new Date(),
	      data: {
	        firstLang: sentenceFirst,
	        secondLang: sentenceSecond
	      },
	    });
		var wordInstance = { wordId : wordId, sentenceIds : [ sentenceId ] };
		wordsInCollection.push(wordInstance);
	}
  }
	var collectionId = Collections.insert({
	    createdAt: new Date(),
	    name: 'Turkish test',
	    words: wordsInCollection
	});
	console.log('Filling test data end');
});
