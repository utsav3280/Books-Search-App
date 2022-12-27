import { useState } from "react";
import axios from "axios";
import "../src/app.css";

function App() {

  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  const [details, setDetails] = useState({ title: "", author: "", pageCount: "", rating: "", id: "" })

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const search = async () => {
    const books = await axios.get("https://www.googleapis.com/books/v1/volumes?q=%7BbookTitle");
    let possible = [];
    console.log(books.data.items[5])
    if (input !== "") {
      for (let i = 0; i < books.data.items.length; i++) {
        let str = books.data.items[i].volumeInfo.title.toLowerCase();
        let search = input.toLowerCase();
        if (search === str) {
          possible.push(books.data.items[i]);
        }
        else if (str.split(search).length >= 2) {
          possible.push(books.data.items[i]);
        }
      }
    }
    setList(possible);
  }

  const showDetails = (idx) => {
    console.log("title: ", list[idx].volumeInfo.title);
    console.log("Authors: ", ...list[idx].volumeInfo.authors);
    console.log("Page-Count: ", list[idx].volumeInfo.pageCount);
    console.log("Rating: ", list[idx].volumeInfo.maturityRating);
    setDetails({ title: list[idx].volumeInfo.title, author: list[idx].volumeInfo.authors, pageCount: list[idx].volumeInfo.pageCount, rating: list[idx].volumeInfo.maturityRating, id: idx })
  }

  return (
    <div className="big-container">
      <div className="heading-container">
        <h1 className="heading">Book Search</h1>
      </div>
      <div className="search-container">
        <input className="input-box" value={input} placeholder="search" onChange={(e) => { handleChange(e) }} />
        <button onClick={search} className="search-btn">Search</button>
      </div>
      <div className="books-list-container">
        {
          list.map((ele, idx) => {
            return (
              <span className="specific-book" key={idx}>
                <a href={ele.volumeInfo.previewLink} target="_blank" rel="noreferrer"><img alt="book-img" className="books" src={ele.volumeInfo.imageLinks.thumbnail} onMouseOver={() => { showDetails(idx) }} />
                  {idx === details.id ? <div className="book-details">
                    <p className="details-text">{details.title}</p>
                    <p className="details-text">{details.author}</p>
                    <p className="details-text">Page-Count: {details.pageCount}</p>
                    <p className="details-text">Rating: {details.rating}</p>
                  </div> : <div></div>}</a>
              </span>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
