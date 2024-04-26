import Header from "../../../components/Header";
import Search from "../../../components/Search";
import Title from "../../../components/Title";
import AthletesList from "../../../components/AthletesList";

export default function Athletes() {
  return (
    <>
      <Header />
      <div className="d-flex justify-content-between align-items-center m-3">
        <Title title="Atletas" />
        <Search />
      </div>
      <AthletesList />
    </>
  )
}