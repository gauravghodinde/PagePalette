import React, { useState, useEffect } from "react";
import { ReactReader } from "react-reader";

const App = () => {
  const [location, setLocation] = useState(0);
  const [selections, setSelections] = useState([]);
  const [rendition, setRendition] = useState(undefined);
  const [image, setImage] = useState(null)
  const [send,setSend] = useState(false)
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



  useEffect(() => {
    if (send && selections.length > 0) { // Added check for selections length
      async function fetchData() {
        console.log("fetching " + selections[selections.length - 1]?.text)
        let data = { "inputs": selections[selections.length - 1]?.text };
        const response = await fetch(
          "https://api-inference.huggingface.co/models/SaiRaj03/Text_To_Image",
          {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
          }
        )
        
        const result = await response.blob();
        const url = window.URL.createObjectURL(result);
        setImage(url); 
        setSend(false)// Changed from useImage to setImage
      }
      fetchData();
    }
  }, [send]);


  return (
    <div style={{ height: "100vh" }}>
      <h1>{selections[selections.length - 1]?.text}</h1>
      <button
        onClick={() =>{
          setSelections([])
          rendition?.annotations.remove(selections[0]?.cfiRange, "highlight")
        }
        }
      >
        clearSelection
      </button>
      <img className="blob-to-image" src={image}></img>
      <button
        onClick={()=> setSend((send)=>!send)}
      >
        send
      </button>
      <ReactReader
        url="https://react-reader.metabits.no/files/alice.epub"
        location={location}
        locationChanged={(epubcfi) => setLocation(epubcfi)}
        getRendition={(_rendition) => {
          setRendition(_rendition);
        }}
      />
    </div>
  );
};

export default App;
