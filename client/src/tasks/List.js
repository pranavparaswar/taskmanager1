import React, { useState, useEffect } from 'react'
import { API_URL } from '../config';
import EachTask from './EachTask';
import axios from "axios"
import { Link, useSearchParams, useNavigate } from "react-router-dom";


export default function List(){
    const [tasks,setTasks] = useState([])
    const [pages,setPages] = useState(0)
    const [searchParams,setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    const openModal = () =>{
        document.getElementById('new-modal').classList.remove("hidden")

    }

    const closeModal = () =>{
        document.getElementById('new-modal').classList.add("hidden")
    }

    const fetchData = async () => {
        const page = searchParams.get("page") ? "&page=" + searchParams.get("page") : '';
        console.log("API URL:", API_URL);
        try {
            const response = await fetch(`${API_URL}/task?sort=-id&size=5${page}`);
            console.log(response)
            const json = await response.json();
            
            console.log(json)
            setTasks(json.data.items);
            setPages(json.data.total_pages)
        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const completeForm = async (form) => {
        console.log("complete form called")
        closeModal()
        form.reset()
        await fetchData();
        navigate("/")
    }

     const storeTask = (e) => {
    e.preventDefault();
    var form = document.getElementById('newform');
    var formData = new FormData(form);

    axios.post(`${API_URL}/task`, formData)
        .then((res) => {
            completeForm(form);
        })
        .catch((error) => {
            if (error.response.status === 400 && error.response.data.message === "Coudlnt create user") {
                // Handle uniqueness constraint violation
                alert('Task name must be unique. Please choose a different name.');
            } else {
                console.log(error.response);
            }
        });
};

    let myPage=searchParams.get("page") ? searchParams.get("page") : 0;
    return (
        <div className="">
            <div className = "flex justify-center">
                <div className='lg:w-1/3 w-full'>
                    <div className='p-10'>
                        <div className='mb-10 flex flex-col mb-8 items-center justsify-between'>
                            <h1 className="font-bold text-3xl mb-4" style={{fontsize: '2rem'}}>Task Manager</h1>
                            <button className="bg-blue-500 text-white px-3 py-1.5 rounded" onClick={openModal} >AddTask</button>
                        </div>
                        <div className="">
                            {tasks.length > 0 ? tasks.map((task,key) => <EachTask key={key} task={task} fetchData={fetchData} />) : ''}
                        </div>

                        <div className="mt-10">
                            {Array.from({ length: pages }, (_, index) => index + 1).map((pg, key) =>
                                <Link className={`border px-3 py-1 mr-3 ${myPage == key ? 'bg-blue-500 text-blue-100' : ''}`} to={`?page=${key}`} key={key}>{key + 1}</Link>)}
                        </div>
                        {/* Start modal */}
                        <div className="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true" id="new-modal">
                            <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"></div>

                            <div className="fixed z-10 inset-0 overflow-y-auto">
                                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                    <div className="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
                                        <form id="newform" onSubmit={storeTask} method="post">
                                            <div className="bg-white">
                                                <div className="flex justify-between px-8 py-4 border-b">
                                                    <h1 className="font-medium">Create new task</h1>
                                                    <button type="button" onClick={closeModal}>Close</button>
                                                </div>
                                                <div className="px-8 py-8">
                                                    <div className="mb-5">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2">Task Name</label>
                                                        <input type="text" name="TaskName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2">Note</label>
                                                        <input type="text" name="note" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                    </div>
                                                    
                                                    <div className="mb-5">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2">Due by</label>
                                                        <input type="date" name="deadline" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                    </div>
                                                    
                                                    <div className="flex justify-end">
                                                        <button className="bg-blue-500 text-white py-1.5 px-4 rounded" type="submit">Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )


}
