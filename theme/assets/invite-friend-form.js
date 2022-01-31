"use strict";

function returnIsPhone() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return true;
  } else if (/iPhone/.test(userAgent) && !window.MSStream) {
    return true;
  } else {
    return false;
  }
}

function InviteFriendForm({
  props
}) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isPhone, setIsPhone] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const handleSendText = async () => {
    setIsLoading(true);
    const customerInput = {
      firstName: "First Name",
      lastName: "Last Name"
    };
    const inviteResponse = await fetch('https://test-api.suavecito.com/api/shopify/warehouse/invite-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerInput)
    });
    const data = await inviteResponse.json();
    window.open(`sms:&body=You are invited to shop the exclusive online Suavecito Warehouse Sale. Follow the link the create your account! ${data.url}`, "_self");
    setIsLoading(false);
  };

  const handleSendInvite = async () => {
    setIsSending(true);
    const customerInput = {
      firstName,
      lastName,
      phone
    };
    const inviteResponse = await fetch('https://test-api.suavecito.com/api/shopify/warehouse/invite-friend-and-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerInput)
    });
    const data = await inviteResponse.json();
    setFirstName('');
    setLastName('');
    setPhone('');
    setIsSending(false);
    console.log(data);
  };

  React.useEffect(() => {
    setIsPhone(returnIsPhone());
  }, [returnIsPhone]);
  return /*#__PURE__*/React.createElement("div", null, isPhone && /*#__PURE__*/React.createElement("div", {
    className: "text-friend"
  }, /*#__PURE__*/React.createElement("h3", null, "Text Your Friend An Invite Link"), /*#__PURE__*/React.createElement("div", null, !isLoading ? /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: handleSendText
  }, "Send Text") : /*#__PURE__*/React.createElement("p", {
    className: "v-center"
  }, "Loading ", /*#__PURE__*/React.createElement("img", {
    src: data.loadingGifUrl,
    alt: "loading"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "h4"
  }, /*#__PURE__*/React.createElement("span", null), "OR", /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("h3", null, "Tell Us About Your Friend"), /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "firstName"
  }, "First Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "firstName",
    onInput: e => setFirstName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "lastName"
  }, "Last Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "lastName",
    onInput: e => setLastName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Phone Number"
  }, "Phone Number"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    id: "Phone Number",
    onInput: e => setPhone(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, !isSending ? /*#__PURE__*/React.createElement("input", {
    className: "btn",
    type: "button",
    value: "Send Invite",
    onClick: handleSendInvite,
    style: {
      marginTop: 28
    }
  }) : /*#__PURE__*/React.createElement("p", {
    className: "v-center",
    style: {
      marginTop: 28
    }
  }, "Sending ", /*#__PURE__*/React.createElement("img", {
    src: data.loadingGifUrl,
    alt: "loading"
  })))));
}

const domContainer = document.querySelector("#invite-friend-form");
const data = domContainer.dataset;
ReactDOM.render( /*#__PURE__*/React.createElement(InviteFriendForm, {
  data: data
}), domContainer);