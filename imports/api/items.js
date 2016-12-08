import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Items = new Mongo.Collection('items');

if(Meteor.isClient){
	Meteor.subscribe('items');
}

if(Meteor.isServer){
	Meteor.publish('items', function (){
		return Items.find(
			{owner: this.userId},
	);
})
}
Meteor.methods({
	'items.insert'(text){
		check(text, String);
		if(! this.userId){
			throw new Meteor.Error('not-authorized');
		}

		Items.insert({
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});
	},
	'items.remove'(itemId){
		check(itemId, String);
		const item = Items.findOne(itemId);
		if(item.private && item.owner !== this.userId){
			throw new Meteor.Error('not-authorized');
		}
		Items.remove(itemId);
	},
	/*
	'items.setChecked'(itemId, setChecked){
		check(itemId, String);
		check(setChecked, Boolean);
		const item = Items.findOne(itemId);
		if(item.private && item.owner !==this.userId){
			throw new Meteor.Error('not-authorized');
		}
		Items.update(itemId, {$set: {checked: setChecked}});
	},*/
	/*'items.setPrivate'(itemId, setToPrivate){
		check(itemId, String);
		check(setToPrivate,Boolean);

		const item = Items.findOne(itemId);

		if(item.owner !== this.userId){
			throw new Meteor.Error('not-authorized');
		}
		Items.update(itemId, {$set: { private: setToPrivate}});
	},*/
});