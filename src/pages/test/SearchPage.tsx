import { useState } from "react";
import { tProfile } from "../../types/Types";
import { useNavigate } from "react-router-dom";

export function cutNameFromGoogleStupidApi(inputString: string) {
  const symbolsToCheck = [",", "(", "/"];

  // Initialize the index variable
  let index = inputString.length;

  // Loop through each symbol to find the earliest occurrence
  for (let symbol of symbolsToCheck) {
    const symbolIndex = inputString.indexOf(symbol);
    if (symbolIndex !== -1 && symbolIndex < index) {
      index = symbolIndex;
    }
  }

  // Take the substring before the earliest occurrence of any symbol
  return inputString.substring(0, index);
}

export function deleteSubstring(inputString: string) {
  // Find the index of the last comma
  let lastIndex: number = inputString.lastIndexOf(",");

  inputString = inputString.charAt(0).toUpperCase() + inputString.slice(1);

  // Check if comma exists in the string
  if (lastIndex !== -1) {
    // Extract substring before the last comma
    let substring: string = inputString.substring(0, lastIndex);

    // Print the substring
    console.log(substring);

    return substring;
  } else {
    return inputString;
  }
}

function SearchPage() {
  const nav = useNavigate();
  const [profileResponce, setProfileResponce] = useState<[tProfile]>();

  const [searchMode, setSearchMode] = useState<string>("ARTICLE");
  const [languageMode, setLanguageMode] = useState<string>("EN");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const BASE_URL = "http://localhost:3000/api/";

  function handleSearch() {
    if (searchMode === "ARTICLE") {
    } else if (searchMode === "PROFILE") {
      (async () => {
        const response = await fetch(BASE_URL + `profiles/${searchQuery}`).then(
          async (res) => {
            return await res.json();
          }
        );
        console.log(response);

        setProfileResponce(response);
      })();
    }
  }

  return (
    <>
      <div className="container px-4 mx-auto bg-[#191a1c] flex flex-col max-w-screen-xl">
        <div className="search panel flex my-10  gap-4">
          <div className="flex gap-1 font w-5/6 ">
            <select
              name=""
              id=""
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value)}
              className="appearance-none m-x-auto p-2 px-4 text-xxl rounded-l-md text-white font-bold bg-[#2c2c2c] focus:outline outline-[#ff6740] outline-offset-[-3px]"
            >
              <option value="EN">EN</option>
              <option value="UA">UA</option>
            </select>
            <input
              type="text"
              className="focus:outline outline-[#ff6740] outline-offset-[-3px]  m-x-auto p-2 px-4 text-xxl text-white w-5/6 bg-[#2c2c2c]"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              value={searchQuery}
            />
            <select
              name=""
              id=""
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="appearance-none m-x-auto p-2 px-4 text-xxl rounded-r-md text-white font-bold bg-[#2c2c2c] focus:outline outline-[#ff6740] outline-offset-[-3px]"
            >
              <option value="ARTICLE">ARTICLE</option>
              <option value="PROFILE">PROFILE</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="w-1/6 justify-center gap-5 items-baseline text-center flex rounded-md bg-[#ff6740] text-white p-2 font-bold"
          >
            Search
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search font-bold"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        </div>
        {profileResponce ? (
          <div className="resultTable text-white flex justify-around flex-wrap text-2xl gap-2">
            {profileResponce.map((profile, index) => {
              return (
                <div
                  key={index}
                  className="Profile relative bg-[#2c2c2c] flex flex-col rounded-md px-4 py-4 gap-3 w-[49%]"
                >
                  <div
                    onClick={() => {
                      nav(`/author/${profile.author_id}`);
                    }}
                    className="absolute top-4 right-4"
                  >
                    X
                  </div>
                  <div className="avatar_name_aff flex flex-row items-start gap-3 ">
                    <img
                      className="min-w-24 h-24 rounded-md"
                      src={profile.thumbnail}
                      alt="No img"
                    />

                    <div>
                      <span className="">
                        {cutNameFromGoogleStupidApi(profile.name)}
                      </span>
                      <br />
                      <span className="text-xl text-slate-400">
                        {deleteSubstring(profile.affiliations)}
                      </span>
                    </div>
                  </div>

                  {profile.interests ? (
                    <span className="text-xl">
                      {profile.interests.map((interest, index) => {
                        return (
                          interest.title.charAt(0).toUpperCase() +
                          interest.title.slice(1) +
                          (index + 1 == profile.interests?.length ? "" : ", ")
                        );
                      })}
                    </span>
                  ) : (
                    <>ABOAB</>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <>ABOBA</>
        )}
      </div>
    </>
  );
}

export default SearchPage;
