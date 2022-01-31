"use strict";

class ReactInviteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "Hello from React" };
  }
  render() {
    return <p>{this.state.message}</p>;
  }
}

const domContainer = document.querySelector("#react-form");
ReactDOM.render(<ReactInviteForm />, domContainer);
