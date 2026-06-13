import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "../../../styles/Login.module.css";
import { LoginRequestDTO } from "@/lib/http-service/tokenService/dto";
import React from "react";
import Loading from "react-loading";
import { useRouter } from "next/router";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAuthService } from "@/lib/auth";
import PasswordInput from "@/components/PasswordInput";

interface LoginFormData extends LoginRequestDTO {
  rememberMe: boolean;
}

export default function Login() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    try {
      const authService = createAuthService();
      await authService.login(data.email, data.password, data.rememberMe);
      router.push("/secure/athletes");
    } catch (e: unknown | any) {
      let errorMessage: string;
      if (e.message === "Unable to complete login") {
        errorMessage = "Não foi possível completar o login";
      } else if (e.response && e.response.data && e.response.data.errors) {
        errorMessage = e.response.data.errors[0].message;
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
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
        icon: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // Check new auth storage keys first, fall back to legacy "token" key
    const preference = localStorage.getItem("storage_preference");
    const token = preference === "session"
      ? sessionStorage.getItem("access_token")
      : localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || localStorage.getItem("token");

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
              {(() => {
                const { ref, ...rest } = register("password", {
                  required: "Password is a required field",
                });
                return (
                  <PasswordInput
                    id="password"
                    className="w-100 p-2 bg-white rounded-4 border border-0"
                    inputRef={ref}
                    {...rest}
                  />
                );
              })()}
              {errors.password && <span className="text-danger mt-1 d-block">{errors.password.message}</span>}
            </div>
            <div className="w-100 mb-3 d-flex align-items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="me-2"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberMe" className="text-white">
                Manter logado
              </label>
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
