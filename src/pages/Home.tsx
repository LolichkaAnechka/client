import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex justify-around w-full mt-3">
      <Link className="border p-2" to="/test/author">
        TEST author
      </Link>
      <Link className="border p-2" to="/test/profiles">
        TEST profiles
      </Link>
      <Link className="border p-2" to="/test/organic">
        TEST organic
      </Link>
      <Link className="border p-2" to="/test/searchpage">
        SearchPage
      </Link>
    </div>
  );
}
export default Home;
