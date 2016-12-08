import { Mateor } from 'meteor/meteor';
import { Tamplate } from 'meteor/templating';

import './item.html';

Template.item.helpers({
	isOwner(){
		return this.owner === Meteor.userId();
	},
});


Template.item.events({
'click .toggle-checked'(){
	Meteor.call('item.setChecked', this._id, !this.checked);
	},
	
'click .delete'(){
	Meteor.call('items.remove' ,this._id);
},
'click .toggle-private'(){
	Meteor.call('items.setPrivate', this._id, !this.private);
},
});