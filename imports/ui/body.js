import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import {Items} from '../api/items.js';

import './item.js';
import './body.html';

Template.registerHelper('formatDate', function(date){
	return moment(date).format('MM-DD-YYYY');
});

Template.body.onCreated(function bodyOnCreated(){
	this.state = new ReactiveDict();
	Meteor.subscribe('items');
});

Template.body.helpers({
	items(){
		const instance = Template.instance();
		if(instance.state.get('hideCompleted')){
			return Items.find({checked: {$ne: true}}, {sort: { createdAt: -1}});
		}
		return Items.find({}, { sort: { createdAt: -1}});
	},

		incompleteCount(){
			return Items.find({checked: {$ne: true}}).count();
		},
	
});


Template.body.events({
	'submit .new-item'(event){
		event.preventDefault();

	const target = event.target;
	const text = target.text.value;


	Items.insert({
		text,
		createdAt:new Date(),
		owner: Meteor.userId(),
		username: Meteor.user().username,
	});

	Meteor.call('items.insert',text);
	target.text.value='';
	},

	'Change .hide-completed input'(event, instance){
		instance.state.set('hide-completed', event.target.checked);
	},
});

