import React, { useState } from "react";
import { saveShippingAddress } from "./services/shippingService";
 
const STATUS = {
    IDLE: "IDLE",
    SUBMITTED: "SUBMITTED",
    SUBMITTING: "SUBMITTING",
    COMPLETED: "COMPLETED"
}
// Declaracija izvan komponente da se vrijednosti ne stave na svaki render
const emptyAddress = {
  city: "",
  country: "",
};

export default function Checkout({ cart, emptyCart }) {
  const [ address, setAddress ] = useState(emptyAddress);
  const [ status, setStatus ] = useState(STATUS.IDLE);
  const [ saveError, setSaveError ] = useState(null);
  const [ touched, setTouched ] = useState({})

  // derived state
  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    e.persist(); //zbog set state kao funkcije, react obrise event prije nego što možemo pristupiti (garbage collect)
    setAddress( (currAddress) => {
        return {
            ...currAddress,
            [ e.target.id ]: e.target.value
        }
    })
  }

  function handleBlur(e) {
    e.persist();
    setTouched( (current) => {
        console.log(current)
        return {...current, [e.target.id]: true}
    })
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    if(isValid) {
        try {
            await saveShippingAddress(address);
            emptyCart();
            setStatus(STATUS.COMPLETED);
        } catch(e) {
            setSaveError(e);
        }
    } else {
        setStatus(STATUS.SUBMITTED)
    }
  }

  function getErrors(address) {
      const result = {};
      if(!address.city) result.city = "City is requried";
      if(!address.country) result.country = "Country is required";
      return result;
  }

  if(saveError) throw saveError;
  if(status === STATUS.COMPLETED) {
      return <h1>Thanks for shopping</h1>
  }

  return (
    <>
      <h1>Shipping Info</h1>
      { !isValid && status === STATUS.SUBMITTED && (
          <div role="alert">
              <p>Please fix the following errors</p>
              <ul>
                  { Object.keys(errors).map((key) => {
                      return <li key={key}>{errors[key]}</li>
                  }) }
              </ul>
          </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={address.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.city || status === STATUS.SUBMITTED) && errors.city}
          </p>
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="India">Croatia</option>
            <option value="United Kingdom">BiH</option>
            <option value="USA">Slovenija</option>
          </select>
          <p role="alert">
            {(touched.country || status === STATUS.SUBMITTED) && errors.country}
          </p>
        </div>

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
