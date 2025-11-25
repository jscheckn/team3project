import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "../Login.css";

// https://www.geeksforgeeks.org/reactjs/react-hook-form-create-basic-reactjs-registration-and-login-form/ 


function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = () => {
    //   fill in
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
                <input type="submit" className="button-54"  />
            </form>
            <h3 id="NotSigned">Not Signed up?</h3>
            <h4 id="SignUp"><Link to="/signUp" >Create On Here</Link></h4>
        </article>
            
        </>
    );
}

export default Login;