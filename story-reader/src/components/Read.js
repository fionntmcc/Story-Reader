import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Badge, Button, ButtonGroup } from 'react-bootstrap';
import TabBar from './TabBar.js';
import { ThemeContext } from '../context/ThemeContext';
import { ToggleButton } from 'react-bootstrap';
import { set } from 'mongoose';

export default function Read() {
  const { theme } = useContext(ThemeContext);
  let { id } = useParams();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [pageText, setPageText] = useState("");
  const [activeBook, setActiveBook] = useState(false);
  const [isActive, setIsActive] = useState(id === localStorage.getItem("activeBook"));

  const [page, setPage] = useState(() => {
    if (localStorage.getItem("activeBook") === id) {
      return parseInt(localStorage.getItem("activePage"));
    } else {
      return 1;
    }
  });

  const PAGE_SIZE = 200;

  // Initial render of book
  useEffect(() => {
    axios.get('http://localhost:4000/api/book/' + id)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.text);
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setYear(response.data.year);
        setText(response.data.text.split(" "));
        console.log(text);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, theme]);

  // render of active book and page
  useEffect(() => {
    setPageText(getPage(page));
    if (localStorage.getItem("activeBook") === id) {
      console.log("setting active page: ", page);
      localStorage.setItem("activePage", page);
    }
  }, [page, text]);

  // get text for current page
  function getPage(page) {
    var pageText = "";
    var i = (page - 1) * PAGE_SIZE;
    while (i < page * PAGE_SIZE && i < text.length) {
      pageText += text[i] + " ";
      i++;
    }
    return pageText;
  }

  function prevPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function nextPage() {
    if (page < Math.ceil(text.length / PAGE_SIZE)) {
      setPage(page + 1);
    }
  }

  function toggleActiveBook() {

    if (activeBook) {
      setActiveBook(false); // trigger useEffect()
      setIsActive(false);
    } else {
      setActiveBook(true); // trigger useEffect()
      setIsActive(true);
    }

    console.log("setActive book");
    if (localStorage.getItem("activeBook") !== id) {
      localStorage.setItem("activeBook", id);
      localStorage.setItem("activePage", page);
    } else {
      localStorage.removeItem("activeBook");
    }
  }

  return (
    <div className={`read-component ${theme}`}>
      <h1 className="center-text">{title} <Badge bg="secondary">{year}</Badge></h1>

      <div className="form-check form-switch" style={{ marginBottom: '20px' }}>
        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={toggleActiveBook} checked={isActive} />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Set as Active Book</label>
      </div>

      <h4>by {author}</h4>
      <p style={{ textAlign: 'justify', marginBottom: '20px' }}>{pageText}</p>

      <ButtonGroup aria-label="Page navigation" style={{ marginBottom: '20px' }}>
        <Button variant="primary" onClick={prevPage}>Prev</Button>
        <Button variant="secondary">Page: {page}</Button>
        <Button variant="primary" onClick={nextPage}>Next</Button>
      </ButtonGroup>
    </div>
  );
}