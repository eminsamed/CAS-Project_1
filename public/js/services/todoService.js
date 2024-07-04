export const createTodo = async (pTodo) => {
  const response = await fetch("http://localhost:3000/api/v1/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pTodo),
  });
  const data = await response.json();
  return data;
};

export const getTodos = async () => {
  const response = await fetch("http://localhost:3000/api/v1/todos");
  const data = await response.json();
  return data;
};

export const updateTodo = async (pId, pTodo) => {
  const response = await fetch(`http://localhost:3000/api/v1/todos/${pId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pTodo),
  });
  const data = await response.json();
  return data;
};
