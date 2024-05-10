import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/Login.module.css";

export default function Login() {
  return (
    <>
      <section className={`${styles.bgSectionImage} w-100 min-vh-100 border-primary d-flex align-items-center justify-content-center`}>
        <main
          className={` w-50 rounded-4 px-5 d-flex align-items-center justity-content-center ${styles.cardGlassmorphism}`}
        >
          <form className="w-75 d-flex flex-wrap align-items-center justify-content-center mx-auto">
            <div className="w-100 mb-3">
              <label htmlFor="user" className="d-block text-white mb-1 fw-bold">
                User
              </label>
              <input type="text" id="user" className="w-100 p-2 bg-white rounded-4 border border-0" />
            </div>
            <div className="w-100 mb-3">
              <label htmlFor="password" className="text-white d-block mb-1 fw-bold">
                Password
              </label>
              <input type="password" id="password" className="w-100 p-2 bg-white rounded-4 border border-0" />
            </div>
            <div className="w-50">
              <button className="fw-bol btn bg-success text-white w-100" type="button">
                Log in <FontAwesomeIcon icon={faRightToBracket} />
              </button>
            </div>
          </form>
        </main>
      </section>
    </>
  );
}
