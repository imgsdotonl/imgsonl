import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import styled from 'styled-components';

const Wrapper = styled.div`
  z-index: 1000;
  background-color: rgba(0, 0, 0, .2);
  padding: 50px;
  margin: 0 auto;
  box-sizing: border-box;
`;
const Loader = () => (
  <Wrapper>
    <CircularProgress size={80} thickness={5} />
  </Wrapper>
);

export default Loader;
