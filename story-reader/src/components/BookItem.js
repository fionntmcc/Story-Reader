import React from 'react';
// necessary inputs
// Provides linking to other app routes.
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Buffer } from "buffer";
//import { Buffer } from "buffer";

const BookItem = (props) => {

    useEffect(() => {
        // debug - log books to console whenever props mount
        // or update
        console.log("Books:", props.myBooks);
    }, [props.myBooks]);

    // handler calls axios.delete to delete the book
    const handleDelete = (e) => {
        e.preventDefault();

        // if deleted book is the active book, remove id from local storage
        if (localStorage.getItem("activeBook") === props.myBook._id) {
            localStorage.removeItem("activeBook");
        }
        //console.log("props" + props.myBook._id);
        axios.delete('http://localhost:4000/api/book/' + props.myBook._id)
            .then(() => {
                // reload books
                props.Reload();
            })
            .catch((error) => {
                console.error("Error deleting book:", error);
            });
    }

    // Checks if image was uploaded,
    // if so, convert to base64 (6-bits per character)
    // else, use default image URL
    const posterUrl = props.myBook.posterImg
        ? `data:${props.myBook.posterImg.contentType};base64,${Buffer.from(
            props.myBook.posterImg.data).toString("base64")}`
        : props.myBook.poster;


    // return book information for BookItem
    return (
        /* Bootstrap columns for browse page layout */
        <Col xs={12} sm={6} md={6} className="mb-4 px-4">
            <Card className={`h-100 p-3`}>
                <Card.Header style={
                    {
                        backgroundColor: "#f8f9fa",
                        textAlign: "center",
                        fontSize: "1.5em",
                    }
                }>{props.myBook.title}</Card.Header>
                <Card.Body>
                    <p className="d-flex justify-content-center">
                        {props.myBook.author} ({props.myBook.year})
                    </p>
                    <blockquote className="blockquote mb-0">
                        <div className="d-flex justify-content-center">
                            {posterUrl && (
                                <div className="d-flex justify-content-center">
                                    {/* Book image */}
                                    <img
                                        src={posterUrl}
                                        alt={props.myBook.title}
                                        className="img-fluid"
                                        style={{
                                            maxWidth: "50%",
                                            height: "auto",
                                            marginBottom: "10px",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </blockquote>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-between">
                        <Link to={"/read/" + props.myBook._id}>
                            <Button variant="primary">Read</Button>
                        </Link>
                        <Link to={"/update/" + props.myBook._id}>
                            <Button variant="warning">Update</Button>
                        </Link>
                        <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Col>

    );
}

export default BookItem;