import Image from "next/image";

export default function Header() {
  return (
    <>
    <div className="d-flex justify-content-between m-3">
      <Image
      src="/images/logo-telento-brasil.png"
      width={50}
      height={50}
      alt="company logo"
      />

      <Image
      src="/images/icon-user.png"
      width={50}
      height={50}
      alt="thumbnail user image"
      />
    </div>
    <hr />
    </>
  )
}