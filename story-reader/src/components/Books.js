// necessary inputs
import React from "react";
import BookItem from "./BookItem";
import Row from "react-bootstrap/Row";


// Books holds list of Book objects
const Books = (props) => {

    // Maps the tasks to TaskItem components
  return (
    <div className="container mt-5">
      <Row className="g-6">
        {props.myBooks.map((book) => (
          <BookItem 
            myBook={book} 
            key={book._id}
            Reload={props.ReloadData}   
          />
        ))}
      </Row>
    </div>
  );
}

export default Books;