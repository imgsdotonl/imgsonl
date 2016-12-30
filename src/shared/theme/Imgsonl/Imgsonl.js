/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  pathname: string,
  auth: Object,
};

export default (ComposedComponent: any) => {
  class Imgsonl extends Component {
    props: Props;

    getPageURL() {
      return (typeof(window) !== 'undefined')
      ? window.location.href
      : `http://localhost:3000/${this.props.pathname}`;
    }
    render() {
      return (
        <div>
          <ComposedComponent { ...this.props } url={ this.getPageURL() } />

        </div>
      );
    }
  }

  return Imgsonl;
};
