import { Meteor } from 'meteor/meteor';
import { UserWords } from '../user_words.js';

Meteor.publish('user_words.practice', function() {
	if(this.userId) {
        var user = Meteor.users.findOne(this.userId);
        var nowDate = new Date();
        var secondDate = new Date();
        secondDate.setMinutes(secondDate.getMinutes() - 3);
        var thirdDate = new Date();
        thirdDate.setDate(thirdDate.getDate() - 1);
        var fourthDate = new Date();
        fourthDate.setDate(fourthDate.getDate() - 3);
        var fifthDate = new Date();
        fifthDate.setDate(fourthDate.getDate() - 7);
        return UserWords.find({
        	userEmail: user.emails[0].address,
        	 $or: [ 
                    { bucket: 1 },
                    { $and: [ {bucket: 2}, {lastDate: { $lte: secondDate }} ]},
                    { $and: [ {bucket: 3}, {lastDate: { $lte: thirdDate }} ]},
                    { $and: [ {bucket: 4}, {lastDate: { $lte: fourthDate }} ]},
                    { $and: [ {bucket: 5}, {lastDate: { $lte: fifthDate }} ]}
                ]
        });
    } else {
    	return [];
    }
});

Meteor.publish('user_words.all', function() {
    if(this.userId) {
        var user = Meteor.users.findOne(this.userId);
        return UserWords.find({
            userEmail: user.emails[0].address
        });
    } else {
        return [];
    }
});