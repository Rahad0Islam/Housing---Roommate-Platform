import apiClient from "@/lib/apiClient"




export const userLogin = (payload:{email:string,password:string})=>{
     return apiClient("/auth/login",{method: "POST",body:payload})
}

export const verifyAccount = (payload:{email:string,otp:string})=>{
    return apiClient("/auth/verify-email",{method: "POST",body:payload})
}

export const userLogout = ()=>{
    return apiClient("/auth/logout",{method: "POST"})
}

export const getMe = ()=>{
    return apiClient("/auth/me",{method: "GET"})
}


export const googleLogin = (payload:{idToken:string})=>{
    return apiClient("/auth/google",{method: "POST",body:payload})
} 