import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode"
export default function Googlesignin() {
    return <>
    <GoogleLogin
  onSuccess={credentialResponse => {

    const token = credentialResponse.credential
    console.log("stored...")
    const userobj = jwtDecode(token)
    console.log("userdecodeddata : ",userobj)
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;

    </>
}