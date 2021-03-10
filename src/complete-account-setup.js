/* global React */
/* global ReactDOM */
function validatePhone(phone) {
  // Remove any non-numeric characters
  const _phone = phone.replace(/\D/g, "")
  if (_phone.length === 10) {
    return true
  }
  if (_phone.length >= 11) {
    return true
  }
}

function formatPhone(phone) {
  // Remove any non-numeric characters
  const _phone = phone.replace(/\D/g, "")
  // Handle 10 digit phone numebers
  if (_phone.length === 10) {
    const areaCode = _phone.slice(0, 3)
    const firstThree = _phone.slice(3, 6)
    const lastFour = _phone.slice(6, 10)
    return `+1${areaCode}${firstThree}${lastFour}`
    // Handle phone numbers with a country code
  }
  if (phone.length >= 11) {
    let phoneLength = _phone.length
    const lastFour = _phone.slice(_phone.length - 4, _phone.length)
    phoneLength -= 4
    const firstThree = _phone.slice(phoneLength - 3, phoneLength)
    phoneLength -= 3
    const areaCode = _phone.slice(phoneLength - 3, phoneLength)
    phoneLength -= 3
    const countryCode = _phone.slice(0, phoneLength)
    return `+${countryCode}${areaCode}${firstThree}${lastFour}`
    // Handle numbers too short to be a phone number
  }
  return ""
}

function CompleteAccountSetup({ data }) {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState("")

  const handleSubmit = async () => {
    const customerInput = { email }
    customerInput.id = data.customerId
    if (firstName) customerInput.firstName = firstName
    if (lastName) customerInput.lastName = lastName
    if (phone && validatePhone(phone)) {
      customerInput.phone = formatPhone(phone)
    }
    if (email) {
      try {
        setIsSubmitting(true)
        const updateResponse = await fetch(
          "https://api.suavecito.com/api/shopify/warehouse/update-customer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customerInput),
          }
        )
        const Json = await updateResponse.json()
        if (
          Json.data.customerUpdate.customer &&
          !Json.data.customerUpdate.userErrors.length
        ) {
          window.location.href = "/"
        }
        if (Json.data.customerUpdate.userErrors.length) {
          console.log(Json)
          let errors = "Something went wrong, please try again. "
          for (let i = 0; i < Json.data.customerUpdate.userErrors.length; i++) {
            errors += `${Json.data.customerUpdate.userErrors[i].message}. `
          }
          alert(errors)
          setIsSubmitting(false)
        }
        console.log(Json)
      } catch (error) {
        alert(`Something went wrong. Please try again later. Error: ${error}`)
        console.log(error)
        setIsSubmitting(false)
      }
    } else {
      alert("Please fill out all required fields.")
    }
  }

  return (
    <>
      <h3>Complete your account setup</h3>
      <form id="UpdateCustomer">
        {!data.customerFirstName ||
          (data.customerFirstName === "First Name" && (
            <>
              <div className="form-group">
                <label htmlFor="FirstName">
                  First Name <br />
                  <input
                    id="FirstName"
                    className="input--error"
                    type="text"
                    onInput={e => setFirstName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="LastName">
                  Last Name <br />
                  <input
                    id="LastName"
                    className="input--error"
                    type="text"
                    onInput={e => setLastName(e.target.value)}
                  />
                </label>
              </div>
            </>
          ))}

        <div className="form-group">
          <label htmlFor="CustomerEmail">
            Email <br />
            <input
              id="CustomerEmail"
              className="input--error"
              type="text"
              onInput={e => setEmail(e.target.value)}
            />
          </label>
        </div>

        {!data.customerPhone && (
          <div className="form-group">
            <label htmlFor="CustomerPhone">
              Phone <br />
              <input
                id="CustomerPhone"
                className="input--error"
                type="text"
                onInput={e => setPhone(e.target.value)}
              />
            </label>
          </div>
        )}

        <div className="form-group">
          {!isSubmitting ? (
            <input
              type="button"
              className="btn"
              onClick={handleSubmit}
              value="Submit"
            />
          ) : (
            <p className="v-center" style={{ marginBottom: "0.75rem" }}>
              Submitting <img src={data.loadingGifUrl} alt="loading" />
            </p>
          )}
        </div>
      </form>
    </>
  )
}

const domContainer = document.querySelector("#CompleteAccountSetup")
const _data = domContainer.dataset
ReactDOM.render(<CompleteAccountSetup data={_data} />, domContainer)
