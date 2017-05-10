import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session'; // need to install by running 'meteor add session'

import { routes, onAuthChange } from '../imports/routes/routes';
import '../imports/startup/simple-schema-configuration.js';

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId();
  onAuthChange(isAuthenticated);
});

/*
// To demosntrate 'Session'
Session.set('name', 'Andrew Mead');
Tracker.autorun(() => {
  // run everytime the 'name' get update
  const name = Session.get('name');
  console.log('Name:', name);
});
*/

Meteor.startup(() => {

  Session.set('showVisible', true);

  /*
  // EXAMPLE
  // Call custom meteor method
  // If call the custom method in client,
  // it will run in both server and client
  // the callback is called from server to client, not from client
  // 'greetUser' is custom meteor method created in links.js
  Meteor.call('greetUser', 'Mike', (err, res) => {
    console.log('Greet User Argument', err, res);
  });

  // Challenge:
  Meteor.call('addNumbers', 11, 12, (err, res) => {
    console.log('Add Numbers Argument', err, res);
  });

  */

  ReactDOM.render(routes, document.getElementById('app'));
});
