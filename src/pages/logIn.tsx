import React from "react";
import {FieldValues, useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import "../CSS/Login.css";
import {useAuth} from "../Components/AuthProvider";

// https://www.geeksforgeeks.org/reactjs/react-hook-form-create-basic-reactjs-registration-and-login-form/ 


function Login() {
    const {setLoggedIn} = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        const response = await fetch('/api/accounts/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const {error} = await response.json();
        if (error !== undefined)
            throw new Error(error);
        setLoggedIn(true);
        navigate('/');
    };

    return (
        <>
        <article>
            <h2 id="title">Login</h2>

            <form className="login" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                    id="email"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}
                <br></br>
                
                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                    id="password"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}
                <br></br>
                <input type="submit" className="button-54" value="Login"/>
            </form>
            <h3 id="NotSigned">Don't have an account?</h3>
            <h4 id="SignUp"><Link to="/signUp" >Sign up here.</Link></h4>
        </article>
            
        </>
    );
}

export default Login;