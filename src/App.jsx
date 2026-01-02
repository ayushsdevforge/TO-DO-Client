import React, { useState, useEffect } from "react";
import axios from "axios";


const API_URL = 'http://localhost:5001/api/todos';

const App = () => {
   
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        fetchTodos();
    }, []);

    
    const fetchTodos = async () => {
        try {
            const response = await axios.get(API_URL); 
            setTodos(response.data.data);
            setLoading(false); 
        } catch (error) {
            console.error('Error fetching todos:', error);
            setLoading(false); 
        }
    }

 
    const createTodo = async (e) => {
        e.preventDefault();
        if(newTask.trim() === '') return;
        try { 
            const response = await axios.post(API_URL, { text: newTask });
            setTodos([...todos, response.data.data]);
            setNewTask('');
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    }


    const handleToggleComplete = async (id, completed) => {
        const newCompletedStatus = !completed;
        try {
            await axios.put(`${API_URL}/${id}`, {
                completed: newCompletedStatus
            });
           const updatedTodos = todos.map(t => {
            if (t._id === id) {
              return { ...t, completed: newCompletedStatus };
            } 
            return t;
            });
            setTodos(updatedTodos);

        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };


    const handleDeleteTodo = async (id) => {
        try{
        
            await axios.delete(`${API_URL}/${id}`);
         
            setTodos(todos.filter(t => t._id !== id));
        }
        catch (error) {
            console.error('Error deleting todo:', error);
        }

    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Todo List App 
                </h1>
                
    
                <form onSubmit={createTodo} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                        disabled={newTask.trim() === ''}
                    >
                        Add Todo
                    </button>
                </form>

              
                {loading && (
                    <p className="text-center text-gray-500 py-4">
                        Loading todos...
                    </p>
                )}

                {!loading && todos.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                        No todos yet! 
                    </p>
                )}


           
                <ul className="divide-y divide-gray-200">
                    {todos.map(todo => (
                        <li 
                            key={todo._id} 
                            className={`flex items-center justify-between p-3 transition duration-150 ${todo.completed ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                        >
                            <div 
                                className="flex items-center flex cursor-pointer"
                                onClick={() => handleToggleComplete(todo._id, todo.completed)}
                            >
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggleComplete(todo._id, todo.completed)}
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded mr-4"
                                />
                                <span 
                                    className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                                >
                                    {todo.text}
                                </span>
                            </div>
                            
                            <button
                                onClick={() => handleDeleteTodo(todo._id)}
                                className="ml-4 p-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;