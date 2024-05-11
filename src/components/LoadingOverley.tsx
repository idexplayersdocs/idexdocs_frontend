import Loading from "react-loading";

type LoadingOverlay = {
  isLoading: boolean;
};

export const LoadingOverlay = ({ isLoading }: LoadingOverlay) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={`d-flex justify-content-center align-items-center w-100 min-vh-100 z-3 position-absolute top-0 left-0 overlay`}
    >
      <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
    </div>
  );
};
