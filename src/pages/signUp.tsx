import React from "react";
import { useForm } from "react-hook-form";
import "../CSS/SignUp.css"

// https://www.geeksforgeeks.org/reactjs/react-hook-form-create-basic-reactjs-registration-and-login-form/

function SignUp() {
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
            <h2 id="SignUp">Sign Up</h2>

            <form  className="sign up" onSubmit={handleSubmit(onSubmit)}>
                <input
                    id="Inputs"
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    id="Inputs"
                    type="name"
                    {...register("name", { required: true })}
                    placeholder="Name"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    id="Inputs"
                    type="age"
                    {...register("age", { required: true })}
                    placeholder="Age"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    id="Inputs"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}


                <input
                    id="Inputs"
                    type="password"
                    {...register("confirmPassword", { required: true })}
                    placeholder="Confirm Password"
                />
                {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

                <input id="Submit" type="submit"  />
            </form>
        </>
    );
}

export default SignUp;