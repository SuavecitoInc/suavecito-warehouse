/* global React */
/* global ReactDOM */

function returnIsPhone() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  if (/android/i.test(userAgent)) {
    return true
  }
  if (/iPhone/.test(userAgent) && !window.MSStream) {
    return true
  }
  return false
}

function validatePhone(phoneInput) {
  // Remove any non-numeric characters
  const phone = phoneInput.replace(/\D/g, "")
  if (phone.length === 10) {
    return true
  }
  if (phone.length >= 11) {
    return true
  }
  return false
}

function InviteFriendForm({ data }) {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isPhone, setIsPhone] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const [isSent, setIsSent] = React.useState(false)
  const [hasErrors, setHasErors] = React.useState(false)
  const [inviteData, setInviteData] = React.useState({})

  const handleOpenMessanger = async () => {
    try {
      setIsLoading(true)
      const customerInput = { firstName: "First Name", lastName: "Last Name" }
      const inviteResponse = await fetch(
        "https://api.suavecito.com/api/shopify/warehouse/invite-friend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerInput),
        }
      )
      const Json = await inviteResponse.json()
      window.open(
        `sms:&body=I have access to Suavecito's invite only Online Warehouse Sale. Here is an invitation for you! Follow the link the create your account ${Json.url}`,
        "_self"
      )
      setIsLoading(false)
    } catch (error) {
      alert(`Something went wrong. Please try again later. Error: ${error}`)
    }
  }

  const handleSendInvite = async () => {
    const { customerName } = data
    if (firstName && lastName && phone) {
      if (validatePhone(phone)) {
        try {
          setIsSending(true)
          const customerInput = { firstName, lastName, phone, customerName }
          const inviteResponse = await fetch(
            "https://api.suavecito.com/api/shopify/warehouse/invite-friend-and-text",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(customerInput),
            }
          )
          const _inviteData = await inviteResponse.json()
          setIsSending(false)
          setIsSent(true)
          if (_inviteData.error) {
            setHasErors(true)
            setInviteData(_inviteData)
          }
        } catch (error) {
          alert(`Something went wrong. Please try again later. Error: ${error}`)
          setIsSending(false)
        }
      } else {
        alert("The phone number must be have 10 or 11 digits")
      }
    } else {
      alert(
        "First Name, Last Name, and Phone Number are required to send the account invite."
      )
    }
  }

  React.useEffect(() => {
    setIsPhone(returnIsPhone())
  }, [])
  return (
    <div>
      {isPhone && (
        <div className="text-friend">
          <h3>Text Your Friend An Invite Link</h3>
          <div>
            {!isLoading ? (
              <button
                type="button"
                className="btn"
                onClick={handleOpenMessanger}
                style={{ width: "100%" }}
              >
                Send Text
              </button>
            ) : (
              <p className="v-center">
                Loading <img src={data.loadingGifUrl} alt="loading" />
              </p>
            )}
          </div>
          <div className="h4">
            <span />
            OR
            <span />
          </div>
        </div>
      )}
      {!isSent && (
        <>
          <h3>Tell Us About Your Friend</h3>
          <form>
            <div className="form-group">
              <label htmlFor="firstName">
                First Name*
                <input
                  type="text"
                  id="firstName"
                  onInput={e => setFirstName(e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                Last Name*
                <input
                  type="text"
                  id="lastName"
                  onInput={e => setLastName(e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="Phone Number">
                Phone Number*
                <input
                  type="tel"
                  id="Phone Number"
                  onInput={e => setPhone(e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              {!isSending ? (
                <input
                  className="btn"
                  type="button"
                  value="Send Invite"
                  onClick={handleSendInvite}
                  style={{ marginTop: 24 }}
                />
              ) : (
                <p className="v-center" style={{ marginTop: 24 }}>
                  Sending <img src={data.loadingGifUrl} alt="loading" />
                </p>
              )}
            </div>
          </form>
        </>
      )}
      {isSent && !hasErrors ? (
        <div>
          We sent a text to {firstName || "your friend"} with an invite link. We
          let them know that is was you who invited them!
        </div>
      ) : (
        hasErrors && (
          <div>
            <p>Something went wrong inviting {firstName || "your friend"}.</p>
            {data.errors &&
              data.errors.map((error, i) => (
                <p key={`error-${i}`}>{error.message}</p>
              ))}
            {inviteData.userErrors &&
              inviteData.userErrors.map((error, i) => (
                <p key={`error-${i}`}>{error.message}</p>
              ))}
          </div>
        )
      )}
    </div>
  )
}

const domContainer = document.querySelector("#invite-friend-form")
const _data = domContainer.dataset
ReactDOM.render(<InviteFriendForm data={_data} />, domContainer)
