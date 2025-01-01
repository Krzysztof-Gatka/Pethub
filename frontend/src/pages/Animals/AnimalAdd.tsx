import axios from 'axios'
import React, { useState } from 'react'

const AnimalAdd = () => {
    const [form, setForm] = useState({
        name: '',
        age: '',
        description: '',
        shelter_id: -1,
    })
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('age', form.age);
        formData.append('description', form.description);
        formData.append('shelter_id', form.shelter_id);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:3000/api/animals/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
  return (
    <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} />
            <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
            <input type="text" name="shelter_id" placeholder="Shelter ID" onChange={handleChange} />
            <input type="file" onChange={handleImageChange} />
            <button type="submit">Create Profile</button>
        </form>
  )
}

export default AnimalAdd
