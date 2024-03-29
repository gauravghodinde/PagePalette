import React, { useState, useEffect } from "react";
import { ReactReader } from "react-reader";
import close from "../images/close.png";
import gita from "../books/gita.epub"
import harrypotter from "../books/harrypotter.epub"
import mahabharat from "../books/mahabharat.epub"
// import { client } from "@gradio/client";
const Home = () => {
  const [location, setLocation] = useState(0);
  const [selections, setSelections] = useState([]);
  const [rendition, setRendition] = useState(undefined);
  const [image, setImage] = useState([]);
  const [send, setSend] = useState(false);
  const [dropdown, ToggleDropDown] = useState(false);
  const [modelno, setmodelno] = useState(0);

  var models = [
    
    "blink7630/graphic-novel-illustration",
    "ostris/ikea-instructions-lora-sdxl",
    "ostris/ikea-instructions-lora-sdxl",
    "EarthnDusk/Poltergeist-Mix",
    "SaiRaj03/Text_To_Image",
    "nerijs/pixel-art-xl",
  ];
  
  useEffect(() => {
    if (rendition) {
      function setRenderSelection(cfiRange, contents) {
        if (rendition) {
          // setSelections((list) =>
          //   list.concat({
          //     text: rendition.getRange(cfiRange).toString(),
          //     cfiRange,
          //   })
          // );
          console.log("this" + selections[0]);

          setSelections([
            {
              text: rendition.getRange(cfiRange).toString(),
              cfiRange,
            },
          ]);
          console.log(rendition);
          // rendition.annotations = null

          // setRenderSelection
          // rendition.annotations.add(
          //   "highlight",
          //   cfiRange,
          //   {},
          //   undefined,
          //   "hl",
          //   {
          //     fill: "red",
          //     "fill-opacity": "0.5",
          //     "mix-blend-mode": "multiply",
          //   }
          //   );
          // rendition.annotations = {

          //   "highlight",
          //   cfiRange,
          //   {},
          //   undefined,
          //   "hl",
          //   {
          //     fill: "red",
          //     "fill-opacity": "0.5",
          //     "mix-blend-mode": "multiply",
          //   }
          // }
          const selection = contents.window.getSelection();
          selection?.removeAllRanges();
        }
      }
      rendition.on("selected", setRenderSelection);
      return () => {
        rendition?.off("selected", setRenderSelection);
      };
    }
  }, [setSelections, rendition]);
  // useEffect(async ()=>{

  //   const Home = await client("https://482d034b54caebf30b.gradio.live/");
  //   const result = await Home.predict(2, [
  //     selections[selections.length - 1]?.text, // string  in 'Type' Radio component
  //     ]);

  //   console.log(result.data);

  //     },[])

  useEffect(() => {
    if (send && selections.length > 0) {
      // Added check for selections length
      async function fetchData() {
        console.log("fetching " + selections[selections.length - 1]?.text);
        let data = { inputs: selections[selections.length - 1]?.text };
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${models[modelno]}`,
          {
            headers: {
              Authorization: "Bearer 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",
            },
            method: "POST",
            body: JSON.stringify(data),
          }
        );

        const result = await response.blob();
        const url = window.URL.createObjectURL(result);
        setImage([
          ...image,
          { url: url, text: selections[selections.length - 1]?.text },
        ]);
        setSend(false); // Changed from useImage to setImage
      }
      fetchData();
    }
  }, [send]);

  return (
    <div
      className="bg-white border-gray-200 dark:bg-teal-950 dark:text-white"
      // style={{ height: "100vh" }}
    >
      <div className="p-6 mx-6 rounded-xl flex justify-between bg-yellow-50 dark:bg-teal-900 ">
        <div className="mx-6">{selections[selections.length - 1]?.text}</div>
        <button
          className="mx-6 rounded-lg min-h-5 min-w-11"
          onClick={() => {
            setSelections([]);
            rendition?.annotations.remove(selections[0]?.cfiRange, "highlight");
          }}
        >
          <img src={close} class="size-11" alt="PagePallete Logo" />
        </button>
      </div>

      <div style={{ height: "80vh" }} className="m-6">
        <ReactReader
          url= {mahabharat} // "https://react-reader.metabits.no/files/alice.epub"
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
          epubOptions={{
            allowPopups: true, // Adds `allow-popups` to sandbox-attribute
            allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
          }}
          getRendition={(_rendition) => {
            setRendition(_rendition);
          }}
        />
      </div>
      <div className="m-6 flex justify-around pb-16">
        {/* <button className="px-6 m-2 py-3 bg-yellow-600 dark:bg-teal-700 hover:bg-slate-800 hover:dark:bg-teal-800 rounded text-white">
          choose model
        </button> */}
        <div className="relative">
          <button
            id="dropdownDefaultButton"
            className="text-white px-6 m-2 py-3 bg-yellow-600 dark:bg-teal-700 hover:bg-slate-800 hover:dark:bg-teal-800 rounded  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center inline-flex items-center "
            type="button"
            onClick={() => {
              ToggleDropDown(!dropdown);
            }}
          >
            Model {models[modelno]} {" "}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          <div
            className={`z-10 absolute ${
              dropdown || "hidden"
            } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              {models.map((item, index) => {
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        console.log(index)
                        setmodelno(index);
                        ToggleDropDown((dropdown) => !dropdown);
                      }}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <button
          className="px-6 m-2 py-3 bg-yellow-600 dark:bg-teal-700 hover:bg-slate-800 hover:dark:bg-teal-800 rounded text-white"
          onClick={() => setSend((send) => !send)}
        >
          send
        </button>
        <button className="px-6 m-2 py-3 bg-yellow-600 dark:bg-teal-700 hover:bg-slate-800 hover:dark:bg-teal-800 rounded text-white">
          choose epub
        </button>
      </div>
      <div className="flex flex-wrap p-6 m-6">
        {image
          .slice(0)
          .reverse()
          .map(({ url, text }, index) => {
            return (
              <div
                key={index}
                class="max-w-sm m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <a href="#">
                  <img class="rounded-t-lg" src={url} alt="Wait for 5 min before sending another request or change api or contact Gaurav" />
                </a>
                <div class="p-5">
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {text}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
