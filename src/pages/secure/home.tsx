import Header from "./components/Header";
import Search from "./components/Search";
import Table from "./components/Table";
import Title from "./components/Title";

export default function Home() {
  return (
    <>
      <Header />
      <div className="d-flex justify-content-between align-items-center m-3">
        <Title title="Atletas" />
        <Search />
      </div>
      <Table />
    </>
  )
}