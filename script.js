 let myLibrary = [];
 const addForm = document.querySelector('#add-book');
 const editForm = document.querySelector('#edit-book')
 const showAdd = document.querySelector('#add-icon');
 const closeAdd = document.querySelector('#add-exit');
 const closeEdit = document.querySelector('#edit-exit');
 const deleteBtn = document.querySelector('#delete-btn');
 const editBtn = document.querySelector('#change-btn');
 const span = document.createElement('span');
 const title = document.createElement('t3');
 const edit = document.createElement('a');
 const bookTitle =document.createTextNode('');
 edit.innerText ="edit";
 let menuLinks = document.querySelector('#menu').childNodes;
 let bookShelf = document.querySelector('tbody');
 let header = bookShelf.childNodes[0];
 let editProperties = [];

 function Book(id,image,title,author,score,pages,priority){
     this.id=id;
     this.image =image;
     this.title = title;
     this.author = author;
     this.score=score;
     this.pages = pages;
     this.priority = priority;
     this.pageRead = 0;
 }
 let closeModal=()=>{
   document.querySelector('#modal').style.display="none";
   document.querySelector('#add-book').style.display="none";
 }
 let closeModalEdit = () =>{
  document.querySelector('#modal').style.display="none";
  document.querySelector('#edit-book-div').style.display="none";
 }


 let addBook = (element) =>{
   let newBook = new Book(myLibrary.length,element[2].value,element[4].value,element[6].value,
    element[8].value,element[10].value,element[12].value);
   myLibrary.push(newBook);
  localStorage.setItem('library',JSON.stringify(myLibrary));
  displayBook();
  closeModal();

 }

 let editPopulateFields = (index) =>{
   let bookContent = myLibrary[index];
  editForm.children[editForm.children.length -1].id=index;
  editForm.children[14].setAttribute('max',myLibrary[index].pages)
   let counter =2;
   for( const property in myLibrary[index]){
     switch(property){
       case 'id':
         break;
        default:
          editForm.children[counter].value = bookContent[property];
          counter= counter + 2;    
     }  
   } 

 }

 let editBook = (element) =>{
   bookIndex = editForm.children[editForm.children.length -1].id;
   let editedBook = new Book(myLibrary.length,element[2].value,element[4].value,element[6].value,
   element[8].value,element[10].value,element[12].value);
   editedBook.pageRead = element[14].value;
   myLibrary[bookIndex]= editedBook;
   localStorage.setItem('library',JSON.stringify(myLibrary));
   displayBook();
   closeModalEdit();

 }
 
 let getBooks = () =>{
   if(localStorage.library){
     myLibrary = JSON.parse(localStorage.getItem('library'));
     return;
   }
   localStorage.setItem('library',JSON.stringify(myLibrary));
 }

 let deleteBook = (id) => {
  myLibrary = myLibrary.filter(book => book != myLibrary[id]);
  localStorage.setItem('library',JSON.stringify(myLibrary));
  displayBook();
  closeModalEdit();
 }

 let constructBook = (index) =>{
   let row = bookShelf.insertRow(-1);
   let contentArr = [index,myLibrary[index].image,[myLibrary[index].title,' by '+myLibrary[index].author],
   myLibrary[index].score,myLibrary[index].pageRead + "/"+myLibrary[index].pages,myLibrary[index].priority];
   let classArr=['data-stats','data-image','data-title','data-stats','data-stats','data-stats'];

   row.insertCell(-1).innerHTML ='<div class="status-bar"></div>';
   for(let i=0; i<6;i++){
     switch(i){
       case 1:
        row.insertCell(-1).innerHTML =` <img src='' alt='book.png'>`
        row.childNodes[2].classList.toggle(classArr[i]);
        row.childNodes[2].childNodes[1].src=contentArr[i];
        break
      case 2:
        row.insertCell(-1).appendChild(title.cloneNode(true));
        row.childNodes[3].appendChild(span.cloneNode(true));
        row.childNodes[3].appendChild(edit.cloneNode(true));
        row.childNodes[3].classList.toggle(classArr[i])
        row.childNodes[3].childNodes[0].innerText=contentArr[i][0];
        row.childNodes[3].childNodes[1].innerText=contentArr[i][1];
        row.childNodes[3].childNodes[2].setAttribute('id',index)
        row.childNodes[3].childNodes[2].addEventListener('click', e =>{
          e.preventDefault();
          document.querySelector('.modal').style.display="flex";
          document.querySelector('#edit-book-div').style.display="flex";
          editPopulateFields(e.target.id);
        })
        break
      default:
        row.insertCell(-1).innerText =contentArr[i];
        row.childNodes[row.childNodes.length-1].classList.toggle(classArr[i])
     }
   }
 }
let displayBook = () =>{
  bookShelf.innerText='';
  bookShelf.appendChild(header);
  for(let i=0; i<myLibrary.length;i++){
    constructBook(i);
  }
 
}

 let toggleLink = (link) =>{
  for(let link of menuLinks){
    link.className='';
  }
  link.classList.toggle("active-link");
 }

addForm.addEventListener('submit',e =>{
    e.preventDefault();
    addBook(e.target.children);
    addForm.reset();
});

editForm.addEventListener('submit',e =>{
  e.preventDefault();
  editBook(editForm.children);
  editForm.reset();
});

deleteBtn.addEventListener('click',e =>{
  if(confirm("Are you sure you want to delete this Book?"))
  deleteBook(editForm.children[editForm.children.length -1].id);
})

showAdd.addEventListener('click', e => {
  document.querySelector('.modal').style.display="flex";
  document.querySelector('#add-book').style.display="flex";
});
closeAdd.addEventListener('click', e => closeModal());
closeEdit.addEventListener('click', e => closeModalEdit());


for(let link of menuLinks){
  link.addEventListener('click',e => {
    e.preventDefault();
    toggleLink(e.target);

  })

}
getBooks();
displayBook();



