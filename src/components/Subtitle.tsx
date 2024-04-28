type Props = {
  subtitle: string
}

export default function Subtitle({subtitle}:Props) {
  return (
    <>
      <h2 className="subtitle">{subtitle}</h2>
    </>
  )
}