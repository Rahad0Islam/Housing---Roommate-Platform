'use client'

import { toast } from "@/components/ui/toast";
import { useGoogleLogin } from "@/hooks/auth.hook";
import { GoogleLogin } from "@react-oauth/google";





const GoogleLoginComponent = () => {
const {mutate:googleLogin} = useGoogleLogin();

const handleGoogleLoginSuccess = (response: {credential?:string}) => {

    const idToken = response.credential;

    if(!idToken){
        toast.add({
            title: "Google login failed",
            description: "No credential received from Google. Please try again.",
            type: "error",
          });
          return;
    }

    googleLogin({idToken},{
        onSuccess:()=>{
            toast.add({
                title: "Google login successful",
                description: "You have been logged in successfully.",
                type: "success",
              });
        },
        onError:(error:any)=>{
            toast.add({
                title: "Google login failed",
                description: "An error occurred while logging in with Google. Please try again.",
                type: "error",
              });
              console.error("Google login failed:",error);
        }
    })
  };

  const handleGoogleLoginError = () => {
    toast.add({
        title: "Google login failed",
        description: "An error occurred while logging in with Google. Please try again.",
        type: "error",
      });
      console.error("Google login failed:");
  };    

  return (
      <GoogleLogin
        theme="outline"
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        shape="pill"
        text="continue_with"
        
        /> 
  )

}
 
export default GoogleLoginComponent