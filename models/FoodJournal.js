
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var foodJournalSchema = Schema( {
  ownerId: ObjectId,
  title: String,
  description:String,
  createdAt: Date,
} );

module.exports = mongoose.model( 'FoodJournal', foodJournalSchema );
