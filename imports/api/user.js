import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema'; // for validation in custorm Meteor methods
import { Accounts } from 'meteor/accounts-base';

Accounts.validateNewUser((user) => {
  const email = user.emails[0].address;

  // try-catch block is required so that meteor err can be thrown if anything goes wrong
  // try-catch can be removed after set up of 'defineValidationErrorTransform'
  // in '../startup/simple-schema-configuration'
  // try {
    new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      }
    }).validate({email});
  // } catch (e) {
  //   throw new Meteor.Error(400, e.message);
  // }
  return true
});
