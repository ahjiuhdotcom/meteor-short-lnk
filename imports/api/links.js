import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema'; // for validation in custorm Meteor methods
import shortid from 'shortid';

export const Links = new Mongo.Collection('links');

// if server environment (not client environment)
// 'Meteor.publish()' only available in server
if (Meteor.isServer) {
  // name 'links' can be anything (doesn't refer to to 'links' in mongo collection)
  // as long as same string is used in subscriptions later
  Meteor.publish('links', function () {
    // we can't use 'Meteor.userId()' in 'publish' function (refer to meteor documentation)
    // as alternative, following synstax is used
    const userId = this.userId
    return Links.find({userId});
  });
}

// Define custom methods
// naming convention: resource.action,
// e.g. emails.archive, links.insert
Meteor.methods({
  // put '' because by default we can't put '.' character on the object property name
  // so, put '' can bypass that limitation
  'links.insert'(url) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // try-catch block is required so that meteor err can be thrown if anything goes wrong
    // try-catch block can be removed after set up of 'defineValidationErrorTransform'
    // in '../startup/simple-schema-configuration'
    // try {
      new SimpleSchema({
        url: {
          type: String,
          label: 'Your link',
          regEx: SimpleSchema.RegEx.Url
        }
      }).validate({url});
    // } catch (e) {
    //   throw new Meteor.Error(400, e.message);
    // }

    Links.insert({
      _id: shortid.generate(),
      url,
      userId: this.userId,
      visible: true,
      visitedCount: 0,
      lastVisitedAt: null
    });
  },

  'links.setVisibility'(_id, visible) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      },
      visible: {
        type: Boolean
      }
    }).validate({_id, visible});

    Links.update({
      _id,
      userId: this.userId
    }, {
      $set: {visible}
    });
  },
  'links.trackVisit'(_id){

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({_id});

    Links.update({_id}, {
      $set: {
        lastVisitedAt: new Date().getTime()
      },
      $inc: {
        visitedCount: 1
      }
    });
  }

  /*
  // EXAMPLE
  greetUser(name) {
    console.log('greetUser is running');

    if (!name) {
      throw new Meteor.Error('invalid-arguments', 'Name is required');
    }

    return `Hello user ${name}`;
  },
  addNumbers(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Meteor.Error('invalid-arguments', 'Expecting two numbers');
    }

    return a + b;
  }
  */
});
