import { useEffect, useState } from "react"
import SignUpGoogleUserForm from "../../components/SignUpGoogleUserForm";


const SignUpGoogle = () => {
    
    const [userId, setUserId] = useState(-1);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const usrid = params.get('userId');
        if(usrid) {
            setUserId(Number(usrid));
        }

        
    },[])

    return (
        <>
            <h1>{userId}</h1>
            {userId != -1 && <SignUpGoogleUserForm userId={userId}/>}
            
        </>
        
    )
}

export default SignUpGoogle
