import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "../../../styles/Login.module.css";
import { LoginRequestDTO } from "@/pages/api/http-service/tokenService/dto";
import React from "react";
import Loading from "react-loading";
import { LoginUser } from "@/pages/api/http-service/tokenService";
import { useRouter } from "next/router";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequestDTO>();

  const onSubmit: SubmitHandler<LoginRequestDTO> = async (data) => {
    setIsLoading(true);
    try {
      const res = await LoginUser({ email: data.email, password: data.password });
      localStorage.setItem("token", res.access_token);
      router.push("/secure/athletes");
    } catch (e: unknown | any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (e.response && e.response.data && e.response.data.errors) {
        errorMessage = e.response.data.errors[0].message;
      }
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        icon: false,  // Disable the default icon to avoid the large exclamation mark
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/secure/athletes");
    }
  }, [router]);

  return (
    <>
      <section
        className={`${styles.bgSectionImage} w-100 min-vh-100 border-primary d-flex align-items-center justify-content-center`}
      >
        <main
          className={`rounded-4 px-5 d-flex align-items-center justity-content-center ${styles.cardGlassmorphism}`}
        >
          <form
            className="w-100 d-flex flex-wrap align-items-center justify-content-center mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-100 mb-3">
              <label htmlFor="user" className="d-block text-white mb-1 fw-bold">
                E-mail
              </label>
              <input
                type="text"
                id="user"
                className="w-100 p-2 bg-white rounded-4 border border-0"
                {...register("email", {
                  required: "User is a required field",
                })}
              />
              {errors.email && <span className="text-danger mt-1 d-block">{errors.email.message}</span>}
            </div>
            <div className="w-100 mb-3">
              <label htmlFor="password" className="text-white d-block mb-1 fw-bold">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-100 p-2 bg-white rounded-4 border border-0"
                {...register("password", {
                  required: "Password is a required field",
                })}
              />
              {errors.password && <span className="text-danger mt-1 d-block">{errors.password.message}</span>}
            </div>
            <div className="w-100">
              <button className="fw-bol btn bg-success text-white w-100" type="submit">
                Log in <FontAwesomeIcon icon={faRightToBracket} />
              </button>
            </div>
          </form>
        </main>
        {isLoading ? (
          <div
            className={`d-flex justify-content-center align-items-center w-100 min-vh-100 z-3 position-absolute top-0 left-0 ${styles.overlay}`}
          >
            <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
          </div>
        ) : null}
      </section>
      <ToastContainer />
    </>
  );
}
