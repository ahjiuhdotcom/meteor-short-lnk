import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

// Andrew: Importing the file just sets up the callback.
// The callbacks won't be fired until a user is actually created.
import '../imports/api/user';
import { Links } from '../imports/api/links';
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
  // code to run on server at startup

  // set middle to redirect the link to new url
  WebApp.connectHandlers.use((req, res, next) => {
    // slice(1): start at second character (remove '/' in '/asdc')
    const _id = req.url.slice(1);
    const link = Links.findOne({_id});

    if (link) {
      // '302' means the target resorce is not at current loc,
      // and we are going to send them new
      res.statusCode = 302;
      // Setting the header with key 'Location' & value 'url' is the
      // code that will redirect the user to that new url
      // refer 'https://httpstatuses.com/302' for details
      res.setHeader('Location', link.url);
      res.end();

      Meteor.call('links.trackVisit', _id);
    } else {
      next();
    }
  });

  /*
  // DEMONSTRATION
  // Create custom middleware
  WebApp.connectHandlers.use((req, res, next) => {
    // REQ
    console.log(req.url, req.method, req.headers, req.query);

    // RES
    // Set HTTP status code
    res.statusCode = 404;
    // Set HTTP headers
    res.setHeader('my-custom-header', 'Andrew was here');
    // Set HTTP body
    // When this is called, the res body only show what we put in here
    res.write('<h1>This is my middleware at work!</h1>');
    // End HTTP request
    // When this is called, it will stop the http request,
    // and only res we hv specified above will be returned
    res.end();

    next();
  });
  */

  /*
  // Call custom meteor method
  // 'greetUser' is custom meteor method created in links.js
  Meteor.call('greetUser', 'Mike', (err, res) => {
    console.log('Greet User Argument', err, res);
  })
  */

  /*
  //simpl-schema example:

  // Every key is required by default.
  // To make it optional, it shall be explicitly specified
  const petSchema = new SimpleSchema({
    name: {
      type: String,
      min: 1,
      max: 200,
      optional: true
    },
    age: {
      type: Number,
      min: 0
    },
    contactNumber: {
      type: String,
      optional: true,
      regEx: SimpleSchema.RegEx.Phone
    }
  });

  petSchema.validate({
    name: 'Andrew',
    age: 21,
    contactNumber: '123456'
  });
  */

  /*
  //simpl-schema example 2:

  const employeeSchema = new SimpleSchema({
    name: {
      type: String,
      min: 1,
      max: 200
    },
    hourlyWage: {
      type: Number,
      min: 0
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  })

  employeeSchema.validate({
    name: 'Mike',
    hourlyWage: 35,
    email: 'mike@example.com'
  });
  */

});
