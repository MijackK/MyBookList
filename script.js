 let myLibrary = [];
 let myLibraryFiltered = [];
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
 let sortable = document.querySelectorAll('.sortable');
 let bookShelf = document.querySelector('tbody');
 let header = bookShelf.childNodes[0];
 let editProperties = [];
 let bookShow = document.querySelector("#showing");
 let showSearchBox =false;

 function Book(id,image,title,author,score,pages,priority){
     this.id=id;
     this.image =image;
     this.title = title;
     this.author = author;
     this.score=score;
     this.pages = pages;
     this.priority = priority;
     this.pageRead=0;
    this.status = 'Reading';
     
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
  myLibraryFiltered =myLibrary;
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
   editedBook.status = editedBook.pages == editedBook.pageRead ? 'Completed':element[16].value;
   myLibrary[bookIndex]= editedBook;
   localStorage.setItem('library',JSON.stringify(myLibrary));
   myLibraryFiltered =myLibrary;
   displayBook();
   closeModalEdit();
 }
 
 
 let getBooks = () =>{
   if(localStorage.library){
     myLibrary = JSON.parse(localStorage.getItem('library'));
     myLibraryFiltered =myLibrary;
     return;
   }
   localStorage.setItem('library',JSON.stringify(myLibrary));
   myLibraryFiltered =myLibrary;
 }

 let getFilteredBooks = (choice) =>{
   console.log(choice)
   switch(choice){
     case '0':
       myLibraryFiltered = myLibrary;
       bookShow.innerText = "All Books";
       break;
     case '1':
      myLibraryFiltered = myLibrary.filter(book => book.pageRead != book.pages && book.status =="Reading");
      bookShow.innerText = "Currently Reading";
       break;
     case '2':
      myLibraryFiltered = myLibrary.filter(book => book.pageRead == book.pages);
      bookShow.innerText = "Completed";
       break;
     case '3':
      myLibraryFiltered = myLibrary.filter(book => book.status == 'On Hold');
      bookShow.innerText = "On Hold";
       break;
     case '4':
      myLibraryFiltered = myLibrary.filter(book => book.status == 'Dropped');
      bookShow.innerText = "Dropped";
       break;
     case '5':
      myLibraryFiltered = myLibrary.filter(book => book.status == 'Plan to Read');
      bookShow.innerText = "Plan To Read";
       break;
   }
   displayBook()
  
}

let sortBook = (choice) =>{
  let translation = {'High':2,'Medium':1, 'Low':0};
  switch(Math.abs(choice.id)){
    case 1:
      Number(choice.id)/1 == 1 ? myLibraryFiltered.sort((a,b) => a.title.charCodeAt(0) - b.title.charCodeAt(0)) : myLibraryFiltered.sort((a,b) => b.title.charCodeAt(0) - a.title.charCodeAt(0))
      break;
    case 2:
      Number(choice.id)/2 == 1 ? myLibraryFiltered.sort((a,b) => Number(a.score) - Number(b.score)) : myLibraryFiltered.sort((a,b) => Number(b.score) - Number(a.score))
      break;
    case 3:
      Number(choice.id)/3 == 1 ? myLibraryFiltered.sort((a,b) => a.pages - b.pages) : myLibraryFiltered.sort((a,b) => b.pages - a.pages)
      break;
    case 4:
      Number(choice.id)/4 == 1 ? myLibraryFiltered.sort((a,b) => translation[a.priority] - translation[b.priority]) : myLibraryFiltered.sort((a,b) => translation[b.priority] - translation[a.priority])
      break;
  }
  console.log(translation['High'])
 choice.id= choice.id * -1;
 displayBook();
}

let searchBook = (find) =>{
  myLibraryFiltered = myLibraryFiltered.filter(element => element.title.includes(find));
  displayBook();

}

 let deleteBook = (id) => {
  myLibrary = myLibrary.filter(book => book != myLibrary[id]);
  localStorage.setItem('library',JSON.stringify(myLibrary));
  myLibraryFiltered =myLibrary;
  displayBook();
  closeModalEdit();
 }

 let constructBook = (index) =>{
   let row = bookShelf.insertRow(-1);
   let contentArr = [index,myLibraryFiltered[index].image,[myLibraryFiltered[index].title,' by '+myLibraryFiltered[index].author],
   myLibraryFiltered[index].score,myLibraryFiltered[index].pageRead + "/"+myLibraryFiltered[index].pages,myLibraryFiltered[index].priority];
   let classArr=['data-stats','data-image','data-title','data-stats','data-stats','data-stats'];

   row.insertCell(-1).innerHTML ='<div class="status-bar"></div>';
   changeStatusColor(row.children[0],myLibraryFiltered[index].status);
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

 let changeStatusColor = (bar,status) => {
   switch(status){
     case 'Reading':
      bar.style.background='green';
       break;
      case 'Completed':
        bar.style.background='rgb(64, 101, 186)';
        break;
      case 'On Hold':
        bar.style.background='orange';
        break;
      case 'Dropped':
        bar.style.background='red';
        break;
      case 'Plan to Read':
        bar.style.background='grey';
        break;
   }
 }
let displayBook = () =>{
  bookShelf.innerText='';
  bookShelf.appendChild(header);
  for(let i=0; i< myLibraryFiltered.length;i++){
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

document.querySelector('#search-icon').addEventListener('click', e => {
  showSearchBox = !showSearchBox;
  showSearchBox ? document.querySelector('#search').style.display="block" : document.querySelector('#search').style.display="none"
})

document.querySelector('#search').addEventListener('keydown', e =>{
  if(e.key == "Enter" && e.value !='')
  searchBook(e.target.value);
})

for(let link of menuLinks){
  link.addEventListener('click',e => {
    e.preventDefault();
    toggleLink(e.target);
    getFilteredBooks(e.target.id);
  })}
  for(let link of sortable){
    link.addEventListener('click',e => {
      sortBook(e.target)
    })}

 

getBooks();
displayBook();



