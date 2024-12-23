import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Reusable read component
const Upload = () => {

    // Declare useState() for each value
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    // handle botton click, log book details and post book to server
    const handleSubmit = (e) => {
        e.preventDefault();

        // data to be sent to server
        const formData = new FormData();
        // if user uploaded an image, append it to the form data
        if (file) {
            //formData.append('name', name);
            formData.append('file', file);
        }

        // Post created book to server, retrieve response from server
        axios.post('http://localhost:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log(res.data);
                //navigate('/browse');
            })
            .catch((err) => console.log(err.data));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>

                {/*       <div className="form-group mb-3">
          <label className="form-label">File name:</label>
          <input
            type="text"
            required
            className="form-control"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div> */}

                <div className="form-group mb-3">
                    <label className="form-label">Upload Image:</label>
                    <input
                        type="file"
                        required
                        className="form-control"
                        onChange={(e) => {
                            console.log(e.target.files[0]);
                            setFile(e.target.files[0])
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

export default Upload;