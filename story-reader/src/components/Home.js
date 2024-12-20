import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import { Buffer } from "buffer";
import Carousel from 'react-bootstrap/Carousel';
import App from '../App';
import { set } from 'mongoose';
require('../App.css');

const Home = () => {

  // store book as JSON
  const [book1, setBook1] = useState([]); // initialise books to null
  const [book2, setBook2] = useState([]);
  const [book3, setBook3] = useState([]);
  const [activeBookText, setActiveBookText] = useState("");
  const activeBook = localStorage.getItem("activeBook");
  // axios get request to get active book from database

  function Reload() {
    console.log("Reloading book");
    console.log("active book ", activeBook);
    if (activeBook !== null) {
      axios.get(`http://localhost:4000/api/book/${localStorage.getItem("activeBook")}`)
        .then((response) => {
          // log response
          console.log(response.data);
          setBook1(response.data);
          setActiveBookText("Continue reading");
        })
        .catch((error) => {
          console.log("Error loading book: ", error);
        });
    } else {
      axios.get(`http://localhost:4000/api/random/book`)
        .then((response) => {
          // log response
          console.log(response.data);
          setBook1(response?.data);
          setActiveBookText("Recommended");
        })
        .catch((error) => {
          console.log("Error loading book: ", error);
        });
    }

    axios.get(`http://localhost:4000/api/random/book`)
      .then((response) => {
        // log response
        console.log(response.data);
        setBook2(response?.data);
      })
      .catch((error) => {
        console.log("Error loading book: ", error);
      });

    axios.get(`http://localhost:4000/api/random/book`)
      .then((response) => {
        // log response
        console.log(response.data);
        setBook3(response?.data);
      })
      .catch((error) => {
        console.log("Error loading book: ", error);
      });
  };

  useEffect(() => {
    // debug - log books to console whenever book mounts
    // or updates
    Reload();
  }, []);

  // Checks if image was uploaded,
  // if so, convert to base64
  // else, use default image URL
  const posterUrl1 = book1.posterImg
    ? `data:${book1.posterImg.contentType};base64,${Buffer.from(
      book1.posterImg.data).toString("base64")}`
    : book1.poster;

  const posterUrl2 = book2.posterImg
    ? `data:${book2.posterImg.contentType};base64,${Buffer.from(
      book2.posterImg.data).toString("base64")}`
    : book2.poster;

  // Checks if image was uploaded,
  // if so, convert to base64 (6-bits per character)
  // else, use default image URL
  const posterUrl3 = book3.posterImg
    ? `data:${book3.posterImg.contentType};base64,${Buffer.from(
      book3.posterImg.data).toString("base64")}`
    : book3.poster;

  return (
    <Carousel data-bs-theme="dark" >
      <Carousel.Item className='carousel-container'>
        <img
          className="d-block w-100 carousel-img"
          src={posterUrl1}
          alt="First slide"
        />
        <Carousel.Caption>
          <span className="badge bg-secondary">
            <p>{book1.title} by {book1.author}</p>
            <Link to={`/read/${book1._id}`}>
              <Button variant="primary">Read</Button>
            </Link>
          </span>
        </Carousel.Caption>

        <Carousel.Caption>
          <span className="badge bg-secondary">
            <h5>{activeBookText}</h5>
            <p>{book1.title} by {book1.author}</p>
            <Link to={`/read/${book1._id}`}>
              <Button variant="primary">Read</Button>
            </Link>
          </span>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className='carousel-container'>
        <img
          className="d-block w-100 carousel-img"
          src={posterUrl2}
          alt="Second slide"
        />
        <Carousel.Caption>
          <span className="badge bg-secondary">
            <h5>Recommended </h5>
            <p>{book2.title} by {book2.author}</p>
            <Link to={`/read/${book2._id}`}>
              <Button variant="primary">Read</Button>
            </Link>
          </span>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className='carousel-container'>
        <img
          className="d-block w-100 carousel-img"
          src={posterUrl3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <span className="badge bg-secondary">
            <h5>Recommended</h5>
            <p>{book3.title} by {book3.author}</p>
            <Link to={`/read/${book3._id}`}>
              <Button variant="primary">Read</Button>
            </Link>
          </span>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Home;