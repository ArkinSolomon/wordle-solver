import React from 'react';

//A simple error message for generic error messages
export class ErrorMessage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="message error">
        {this.props.message}
      </div>
    );
  }
}

//A simple success message for generic error messages
export class SuccessMessage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="message success">
        {this.props.message}
      </div>
    );
  }
}