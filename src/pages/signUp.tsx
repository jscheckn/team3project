import React from "react";
import { useForm } from "react-hook-form";

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
                    type="ConfrimPassword"
                    {...register("confrimPassword", { required: true })}
                    placeholder=" Confrim Password"
                />
                {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

                <input type="submit"  />
            </form>
        </>
    );
}

export default SignUp;