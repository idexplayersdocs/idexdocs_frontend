type Props = {
  title: string
}

export default function Title({title}:Props) {
  return (
    <>
      <h1 className="title">{title}</h1>
    </>
  )
}