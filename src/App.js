import React from "react";
import "./App.css";
import {useState} from 'react';
function Header(props) {
  return (
    <header>
      <h1>
        <a href="/" onClick={(event)=>{
          event.preventDefault();
          props.onChangeMode();
        }}>{props.title}</a>
      </h1>
    </header>
  );
}

function Navigator(props) {
  const list = [];
  props.topics.map((topic) => {
    list.push(
      <li key={topic.id}>
        <a id={topic.id} href={"/read/" + topic.id} onClick={event =>{
          event.preventDefault();
          props.onChangeMode(parseInt(event.target.id));
        }}>{topic.title}</a>
      </li>
    );
  });
  return (
    <nav>
      <ol>{list}</ol>
    </nav>
  );
}
function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}
function Create(props) {
  return <article>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body  = event.target.body.value; 
      props.onCreate(title,body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body" ></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}
function App() {
  // const _mode = useState('WELCOME'); // 초기값
  // const mode = _mode[0];
  // const setMode = _mode[1];

  const [mode, setMode] = useState('WELCOME');
  const [id,setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is..." },
    { id: 2, title: "css", body: "css is..." },
    { id: 3, title: "javascript", body: "javascript is..." },
  ]);
  let content = null;
  let contextControl = null;
  if(mode ==='WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  }
  else if(mode ==='READ') {
    let title, body = null;
    topics.map((topic)=>{
      if(topic.id === id) {
        title = topic.title;
        body = topic.body;
      }
    })
    content = <Article title={title} body={body}></Article>;

    contextControl = <>
    <li><a href={'/update/'+id} onClick={e=>{
      e.preventDefault();
      setMode('UPDATE');
    }}>update</a></li>
    <li><input type="button" value="Delete" onClick={()=>{
      const newTopics = []
      for(let i=0; i<topics.length; i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
    }} /></li>
  </>
  }
  else if(mode ==='CREATE') {
    content = <Create onCreate={(_title,_body)=>{
      const newTopic = {id:nextId, title:_title,body:_body}
      
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>;
  }
  else if(mode ==='UPDATE') {
    let title, body = null;
    const pickedIndex = topics.findIndex(topic => {
      return topic.id === id;
    }) 
    title = topics[pickedIndex].title;
    body = topics[pickedIndex].body;

    content = <Update title={title} body={body} onUpdate={
      (title,body) => {
        const newTopics = [...topics];
        newTopics[pickedIndex] = {id:id, title:title, body:body};
        setTopics(newTopics);
        setMode('READ');
      }
    }></Update>  
  }
  return (
    <div className="App">
      <Header />
      <Header />
      <Header title="REACT" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Navigator topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Navigator>
      {content}
      <ul>
      <li><a href="/create" onClick={(e)=>{
        e.preventDefault();
        setMode('CREATE');
      }}>create</a>
      </li>
      {contextControl}
      </ul>
    </div>
  );
}

export default App;
