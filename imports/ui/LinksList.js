import React from 'react';
import { Meteor } from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import { Session } from 'meteor/session'; // refer to demo in main.js (client)
// 'react-flip-move' resposible for the animation
// when the LinksListItem is hiding
import FlipMove from 'react-flip-move';

import { Links } from '../api/links';
import LinksListItem from './LinksListItem';

export default class LinksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    };
  }

  componentDidMount() {
    console.log('componentDidMount LinksList');
    this.linksTracker = Tracker.autorun(() => {
      // string 'links' must be same as string specified
      // in Meteor.publish()
      Meteor.subscribe('links');
      const links = Links.find({
        visible: Session.get('showVisible')
      }).fetch();
      this.setState({ links });
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount LinkList');
    this.linksTracker.stop();
  }

  renderLinksListItems() {
    if (this.state.links.length === 0) {
      return (
        <div className="item">
          <p className="item__status-message">No Links Found</p>
        </div>
      );
    }

    return this.state.links.map((link) => {
      const shortUrl = Meteor.absoluteUrl(link._id);
      return <LinksListItem key={link._id} shortUrl={shortUrl} {...link}/>;
      // return <p key={link._id}>{link.url}</p>
    });
  }

  render() {
    return (
      <div>
        <FlipMove maintainContainerHeight={true}>
          {this.renderLinksListItems()}
        </FlipMove>
      </div>
    )
  }
}
