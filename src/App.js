import "./styles.css";
import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import "./fonts.css";
import domtoimage from "dom-to-image";

const history = [];

export default function App() {
  const [firstTextInput, setFirstTextInput] = useState("");
  const [secondTextInput, setSecondTextInput] = useState("");
  const [images, setImages] = useState(null);
  const [downloadedImage, setDownloadedImage] = useState(null);
  const [index, setIndex] = useState(Math.floor(Math.random() * 100));

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(
        (result) => {
          if (result.ok) {
            return result.json();
          }
          throw Error("Failed to get the data.");
        },
        (error) => {
          throw Error("Network Error:" + error);
        }
      )
      .then((jsonResult) => {
        setImages(jsonResult.data.memes);
        console.log(jsonResult.data.memes);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // try {
  //   const result = await fetch("https://api.imgflip.com/get_memes");
  //   if(result.ok) {
  //     return result.json();
  //   }
  //   throw Error("Failed to get the data.");
  //   const jsonResult = await result.json();
  //   console.log(jsonResult);
  // } catch(error) {
  //   // do if someting went wrong.
  //    console.error(error);
  // }

  const loadFile = (event) => {
    if (event.target.files[0]) {
      console.log(event.target.files[0]);
      const length = images.length;
      setImages((prev) => {
        return [...prev, URL.createObjectURL(event.target.files[0])];
      });

      setIndex(length);
      history.push(index);
      console.log(history);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="memetextInput">
        <input
          className="memeInput"
          type="text"
          placeholder="Top Text"
          value={firstTextInput}
          onChange={(event) => setFirstTextInput(event.target.value)}
        />
        <input
          className="memeInput"
          type="text"
          placeholder="Bottom Text"
          value={secondTextInput}
          onChange={(event) => setSecondTextInput(event.target.value)}
        />
      </div>

      <div className="buttonsArea">
        {/* Previous meme button */}
        <button
          onClick={() => {
            if (history.length > 0) {
              const prevIndex = history.pop();
              setIndex(prevIndex);
              console.log(history);
            }
          }}
        >
          Previous
        </button>

        {/* Next meme button */}
        <button
          className="nextButton"
          onClick={() => {
            setIndex(Math.floor(Math.random() * images.length));
            history.push(index);
            console.log(history);
          }}
        >
          Next
        </button>

        {/* Input file button */}
        <label className="custom-file-upload">
          <input type="file" onChange={(event) => loadFile(event)} />
          Upload
        </label>

        {/* Download meme button */}
        <button
          className="downloadButton"
          onClick={() => {
            if ( firstTextInput === '' && secondTextInput === '') {
              alert("Fill the meme text to download the meme.");
              return;
            }
            var node = document.getElementsByClassName("imageArea")[0];

            domtoimage
              .toPng(node)
              .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                setDownloadedImage(img);
                // document.body.appendChild(img);
              })
              .catch(function (error) {
                console.error("oops, something went wrong!", error);
              });
          }}
        >
          Download
        </button>

        {/* Reset button */}
        <button
          className="resetButton"
          onClick={() => {
            setFirstTextInput("");
            setSecondTextInput("");
            setDownloadedImage(null);
          }}
        >
          Reset
        </button>
      </div>

      <div>
        {images && (
          <figure className="imageArea">
            <h2 id="topText">{firstTextInput}</h2>
            <img
              src={images[index].url ? images[index].url : images[index]}
              alt={images[index].name}
            />
            <h2 id="bottomText">{secondTextInput}</h2>
          </figure>
        )}
        {downloadedImage && (
          <figure className="imageArea">
            <img src={downloadedImage.src} alt="created_image" />
          </figure>
        )}
      </div>
    </div>
  );
}
