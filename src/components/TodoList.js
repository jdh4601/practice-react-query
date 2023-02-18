// rafce 단축키 -> 바로 생성
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todosApi';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  // QueryClient: be used to interact with a cache:
  // useQueryClient: returns the current QueryClient instance.
  const queryClient = new useQueryClient();

  // ✅ useQuery: 데이터를 "GET" 하기 위한 api
  const { isLoading, isError, error, data } = useQuery('todos', getTodos);

  // ✅ mutation: 값을 바꿀 때 사용하는 api
  // useQuery와는 다르게 data를 create/update/delete 할 때 사용한다
  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    addTodoMutation.mutate({
      userId: 1,
      title: newTodo,
      completed: false,
    });
    setNewTodo('');
  };

  const newItemSection = () => {
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new Todo Item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={e => {
            setNewTodo(e.target.value);
          }}
          placeholder="Enter a todo"
        />
      </div>
      <button className="submit">Add</button>
    </form>;
  };

  let content;

  if (isLoading) {
    content = <div>Loading</div>;
  } else if (isError) {
    content = <span>{error.mesage}</span>;
  } else {
    content = data.map(todo => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              id={todo.id}
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <label id={todo.id}>{todo.title}</label>
          </div>
          <button
            className="trash"
            onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
          >
            Delete
          </button>
        </article>
      );
    });
  }

  return (
    <>
      <h1>Todo list</h1>
      {newItemSection}
      <ul>{content}</ul>
    </>
  );
};

export default TodoList;
