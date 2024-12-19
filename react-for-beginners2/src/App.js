import { useState } from "react";

function App() {
  const [toDo, setToDo] = useState("");
  const [toDos, setToDos] = useState([]);
  const onChange = (event) => setToDo(event.target.value);
  const onSubmit = (event) => {
    event.preventDefault();
    if (toDo === "") {  // toDo input이 비었다면 작동하지 않음
      return;
    }
    setToDos(currentArray => [toDo, ...currentArray]);
    setToDo("");  // submit 후 ToDo input 공백으로 비우기
  }
  console.log(toDos);
  return (
    <div>
      <h1>My To Dos ({toDos.length})</h1>
      <form onSubmit={onSubmit}>
        <input value={toDo} onChange={onChange} type="text" placeholder="Write your to do..."/>
        <button>Add To Do</button>
      </form>
    </div>
  );
}

export default App;
