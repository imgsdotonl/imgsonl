import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { Grid, Col, Row } from '../index';

const FooterText = styled.footer`
  padding-top: 75px;
  width: 100%;
`;
class Footer extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        key="1"
        label="Cancel"
        primary
        onTouchTap={ this.handleClose }
      />,
    ];

    return (
    <footer className="footer__wrap">
    <Grid>
      <Row>
      <Col xs={ 12 }>
              <Row xsCenter>
                <Col xs={ 6 }>
                  <FooterText>
                  <span onClick={ this.handleOpen } style={ { fontSize: '.8em', textDecoration: 'underline', cursor: 'pointer' } }>Terms of Service</span><br />
                    Copyright 2016-2017 imgs.onl.
                  </FooterText>
                </Col>
              </Row>
            </Col>
      </Row>
      </Grid>
        <Dialog
          title="Terms of Service"
          actions={ actions }
          modal={ false }
          open={ this.state.open }
          onRequestClose={ this.handleClose }
        >
          <p>Imgs.onl does not allow copyrighted, patented images, or any content considered illegal within the United States of America.</p>
          <p>The service provided by Imgs.onl is provided as-is with no implied
            warranties of any kind. Imgs.onl can not be held responsible for the
            loss of data or other damages which may result from (lack of) functionality
            of our service.</p>
          <p>Imgs.onl reserves the right to deny access to any user who uploads files that compromise the security of our servers, use excessive bandwidth or are otherwise deemed to be misusing the free image hosting service.</p>
          <p>Imgs.onl reserves the right to modify these Terms of Service at any time without prior notification.</p>

          <p>Imgs.onl does not disclose to any of your data to third parties.
            The only exception, obviously, is if we are forced to disclose the
            information as a result of a subpoena or other legal process. For
            legal and disaster recovery reasons we may retain backup and/or
            archival copies of information. We take every reasonable precaution
             to protect your private data from loss, misuse, unauthorized
             access, disclosure, alteration, or destruction.
           </p>
        </Dialog>
    </footer>
    );
  }
}
export default Footer;
