import React from 'react';
import { FormControl, Form } from 'react-bootstrap';

const Date = () => {
  return (
    <div id="date">
      <div id="dateleft">
        <Form>
          <FormControl id="searchbar" type="date" placeholder="Search..." />
        </Form>
      </div>
      <div id="dateright">
        <Form>
          <FormControl id="searchbar" type="date" placeholder="Search..." />
        </Form>
      </div>
    </div>
  );
};

export default Date;
