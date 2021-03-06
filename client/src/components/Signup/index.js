import React, { useState, useContext } from "react";
import { Redirect } from 'react-router-dom';
import { TextInput, Row, Col, Button } from "react-materialize";
import statusAPI from '../../utils/statusAPI';
import StatusContext from '../../utils/StatusContext';
import ProfileImage from "../Cloudinary";

function Login() {
  const { _, updateStatus } = useContext(StatusContext);
  const [ redirect, setRedirect ] = useState(null);
  const [state, setState] = useState({
    username: '',
    password: ''
  });

  function checkRedirect() {
    if (redirect) { return <Redirect to={redirect} /> };
  }

  function handleChange(event) {
    const name = event.target.name;
    setState({ ...state, [name]: event.target.value })
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    const { data } = await statusAPI.signup(state);
    const user  = await statusAPI.login(state);

    // Update status. This will change StatusContext from falsy object to user object.
    await updateStatus(user.data);

    if (data.message) {
      // set message data here
      console.log('DATA.MESSAGE: ', data.message);
      setRedirect('/signup')
    } else {
      setRedirect('/home');
    }
  }

  return (
    <>
      <form>
        {checkRedirect()}
        <Row>
          <Col s={10} offset='s1'>
            <TextInput id='username' name='username' label='Username' noLayout onChange={handleChange}/>
          </Col>
        </Row>
        <Row>
          <Col s={10} offset='s1'>
            <TextInput password id='password' name='password' label='Password' noLayout onChange={handleChange}/>
          </Col>
        </Row>
        <Row>
          <ProfileImage />
        </Row>
        <Button node='button' type='submit' waves='light' onClick={handleSubmit}>Submit</Button>
      </form>
    </>
  );
}

export default Login;
