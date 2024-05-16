import { useState } from "react";
import { tProfile } from "../../types/Types";

const BASE_URL = "http://localhost:3000/api/";

function Profiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResponce, setApiResponce] = useState<[tProfile]>();

  const search = async () => {
    const response = await fetch(BASE_URL + `profiles/${searchQuery}`, 
      
    ).then(
      async (res) => {
        return await res.json();
      }
    );
    console.log(response);

    setApiResponce(response);
  };
  return (
    <>
      <div className="p-10 flex flex-col items-center text-white bg-slate-900 h-screen w-screen">
        <input
          className="p-4 rounded-xl  text-black"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={search}
          className="p-4 flex w-fit justify-center content-center border  border-white rounded-xl"
        >
          Search
        </button>

        <div className="flex flex-col w-full border-white border-solid rounded-lg">
          {apiResponce?.map((result) => {
            return (
              <div
                key={result.name}
                className="result flex w-full justify-between content-center"
              >
                <img src={result.thumbnail} alt="No Img" />
                <span>{result.name}</span>
                <span>{result.affiliations}</span>
                <span>{result.author_id}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Profiles;
