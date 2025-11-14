import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
            <h2>Login</h2>

            <form className="login" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                
                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}


                <input type="submit"  />
            </form>
            <h3>Not Signed up?</h3>
            <li><Link to="/signUp">Create On Here</Link></li>
        </>
    );
}

export default Login;