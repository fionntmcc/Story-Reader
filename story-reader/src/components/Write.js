import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Reusable read component
const Write = () => {

  // useState() is a hook in React that allows you to add 
  // state variables to functional components.
  // This allows for the management of state outside of classes.

  // How to use useState():

  // const [state, setState] = useState(initialValue);
  // state : The value that can be used in the component
  // setState() : Updates the value
  // initialValue : sets value on init

  // Declare useState() for each value
  const [title, setTitle,] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState("");
  const [text, setText] = useState("");
  const [posterImg, setPosterImg] = useState(null);
  const navigate = useNavigate();

  // handle botton click, log book details and post book to server
  const handleSubmit = (e) => {
    e.preventDefault();

    // debug log book details
    //console.log(`Title: ${title}, Author: ${author}, Year: ${year}, Poster: ${poster}`, `Text: ${text}`, `PosterImg: ${posterImg}`);

    // data to be sent to server
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year);
    formData.append('poster', poster);
    formData.append('text', text);
    // if user uploaded an image, append it to the form data
    if (posterImg) {
      formData.append('posterImg', posterImg);
    }

    // Post created book to server, retrieve response from server
    axios.post('http://localhost:4000/api/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log(res.data);
        navigate('/browse');
      })
      .catch((err) => console.log(err.data));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        {/* Input box to change book value */}
        <div className="form-group">
          <label>Add Book Title: </label>
          <input type="text"
            className="form-control"
            value={title}
            onChange={(e) => { setTitle(e.target.value) }}
          />
        </div>

        {/* Input box to change author value */}
        <div>
          <label>Author: </label>
          <input type="text"
            className="form-control"
            value={author}
            onChange={(e) => { setAuthor(e.target.value) }}
          />
        </div>

        {/* Input box to change year value */}
        <div>
          <label>Book Year: </label>
          <input type="text"
            className="form-control"
            value={year}
            onChange={(e) => { setYear(e.target.value) }}
          />
        </div>

        {/* Input box to change poster value */}
        <div>
          <label>Poster URL: </label>
          <input type="text"
            className="form-control"
            value={poster}
            onChange={(e) => { setPoster(e.target.value) }}
          />
        </div>

        {/* Input box to change book value */}
        <div className="form-group">
          <label>Book Text: </label>
          <input type="text"
            className="form-control"
            value={text}
            onChange={(e) => { setText(e.target.value) }}
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Upload Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => {
              console.log(e.target.files[0]);
              setPosterImg(e.target.files[0])
            }}
          />
        </div>

        {/* Submit button - runs handleSubmit() */}
        <div className="form-group">
          <input type="submit" value="Submit" className="btn btn-primary" />
        </div>


      </form>
    </div>
  )
};

export default Write;