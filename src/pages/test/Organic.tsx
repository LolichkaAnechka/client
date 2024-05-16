import { useState } from "react";
import { tScholarOrganic } from "../../types/Types";

const BASE_URL = "http://localhost:3000/api/";

function parseYearFromSummaryLOL(summary: string) {
  const regex = /(\d{4})/;
  const match = regex.exec(summary);

  if (match && match.length > 1) {
    return parseInt(match[1], 10);
  }
  return null;
}

function parseAuthorsFromSummaryCauseGoogleStupid(summary: string) {
  return summary.split("-")[0];
}

function Organic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResponce, setApiResponce] = useState<[tScholarOrganic]>();

  const search = async () => {
    const response = await fetch(BASE_URL + `organic/${searchQuery}`).then(
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
                key={result.title}
                className="result flex w-full justify-between content-center"
              >
                <span>{result.title}</span>
                <span>
                  {result.authors
                    ? result.authors.map((author) => author.name + ", ")
                    : parseAuthorsFromSummaryCauseGoogleStupid(
                        result.summary
                      ) ?? "No info"}
                </span>
                <span>
                  {parseYearFromSummaryLOL(result.summary) ?? "No info"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Organic;
