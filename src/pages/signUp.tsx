import React from "react";
import {FieldValues, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

// https://www.geeksforgeeks.org/reactjs/react-hook-form-create-basic-reactjs-registration-and-login-form/

function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        if (data.password !== data.confirmPassword)
            throw new Error("Passwords do not match");
        const response = await fetch('/api/accounts/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const {error} = await response.json();
        if (error !== undefined)
            throw new Error(error);
        navigate('/login');
    };

    return (
        <>
            <h2>Login</h2>

            <form className="sign up" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    type="name"
                    {...register("name", { required: true })}
                    placeholder="Name"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    type="age"
                    {...register("age", { required: true })}
                    placeholder="Age"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}


                <input
                    type="password"
                    {...register("confirmPassword", { required: true })}
                    placeholder="Confirm Password"
                />
                {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

                <input type="submit"  />
            </form>
        </>
    );
}

export default SignUp;