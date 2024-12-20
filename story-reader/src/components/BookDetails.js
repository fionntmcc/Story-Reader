// necessary inputs
import BookItem from "./BookItem";

// Books holds list of Book objects
const BookDetails = (props) => {
    // give key to identify individual BookItem 
    return <BookItem myBook={props.myBook} key={props.myBook.id}/>
}

export default BookDetails;