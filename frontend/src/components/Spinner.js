import React from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Spinner = () => {
  return (
    <div className="sweet-loading" style={centerStyle}>
      <ClipLoader color="#36D7B7" loading={true} css={override} size={200} />
    </div>
  );
};

const centerStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export default Spinner;
