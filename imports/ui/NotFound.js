import React from 'react';
import { Link } from 'react-router';

/*
export default class NotFound extends React.Component {
  render() {
    return <p>NotFound Component here</p>;
  }
}
*/

export default () => {
  return (
    <div className="boxed-view">
      <div className="boxed-view__box">
        <h1>Page Not Found</h1>
        <p>We-re unable to find that page.</p>
        <Link className="button button--link" to="/">HEAD HOME</Link>
      </div>
    </div>
  );
}
