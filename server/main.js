import '/imports/startup/server/register-api.js';
import { Meteor } from 'meteor/meteor';

import { Words } from '../imports/api/words/words.js';
import { Sentences } from '../imports/api/sentences/sentences.js';
import { Collections } from '../imports/api/collections/collections.js';
import { UserWords } from '../imports/api/user/user_words.js';

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
  // UserWords.remove({});

  console.log('Filling test data start');
  var lines = Assets.getText("english.txt");
  lines = lines.split('\n');
  var i;
  var wordIdIncrement = 1;
  var wordsInCollection = [];
  var wordFirst = "";
  var wordSecond = "";
  var wordSentences = [];
  for (i = 0; i < lines.length; i++) { 
    var line = lines[i];
    var wordRegExp = new RegExp("[a-z]+\\s\\([\\w\\s]+?\\)\\s(adj|adv|conj|n|pn|pr|vi|vt)\\.");
    if(wordRegExp.test(line)){
      wordFirst = line;
    } else if(wordFirst != "" && wordSecond == "" && wordSentences.length == 0){
      wordSecond = line;
    } else if(wordFirst != "" && wordSecond != ""){
      var splits = line.split('•');
      var j;
      for(j = 0; j < splits.length; j++){
        if(splits[j].trim() != ""){
          wordSentences.push(splits[j].trim());
        }
      }
      var wordId = Words.insert({ 
        _id: wordIdIncrement + '',
        createdAt: new Date(),
        data: { 
          firstLang: wordFirst, 
          secondLang: wordSecond 
        } 
      });
      wordIdIncrement++;
      var sIds = [];
      for(j = 0; j < wordSentences.length; j++){
        var sentenceId = Sentences.insert({
          createdAt: new Date(),
          data: {
            firstLang: wordSentences[j],
            secondLang: wordSentences[j]
          },
        });
        sIds.push(sentenceId);
      }
      var wordInstance = { wordId : wordId, sentenceIds : sIds };
      wordsInCollection.push(wordInstance);
      wordFirst = "";
      wordSecond = "";
      wordSentences = [];
    }     
  }
	var collectionId = Collections.insert({
      _id: '888',
	    createdAt: new Date(),
	    name: 'English test',
	    words: wordsInCollection
	});
/*
  var lines = Assets.getText("turkish.txt");
  lines = lines.split('\n');
  var i;
  var wordIdIncrement = 1;
  var wordsInCollection = [];
  for (i = 0; i < lines.length; i++) { 
    var tabs = lines[i].split('\t');
    var wordFirst = tabs[1].trim();
    var wordSecond = tabs[4].trim();
    var sentenceFirst = tabs[5].trim();
    var sentenceSecond = tabs[6].trim();
    // console.log(wordFirst + ' - ' + wordSecond + ' - ' + sentenceFirst + ' - ' + sentenceSecond);
    var wordId = Words.insert({ 
      _id: wordIdIncrement + '',
      createdAt: new Date(),
      data: { 
        firstLang: wordFirst, 
        secondLang: wordSecond 
      } 
    });
    wordIdIncrement++;
    
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
      _id: '999',
      createdAt: new Date(),
      name: 'Turkish test',
      words: wordsInCollection
  });
*/
  // test records for UserWords
  // for (i = 0; i < 5; i++) {
  //   var wordId = wordsInCollection[i].wordId;
  //   UserWords.insert({
  //     createdAt: new Date(),
  //     collectionId: collectionId,
  //     wordId: wordId,
  //     userEmail: 'abylay.s@gmail.com',
  //     lastDate: new Date(),
  //     bucket: 1
  //   });
  // }
	console.log('Filling test data end');
});
