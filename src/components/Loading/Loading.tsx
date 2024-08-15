'use client'

import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center">
    <Spinner animation="border" role="status" className="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
  );
}