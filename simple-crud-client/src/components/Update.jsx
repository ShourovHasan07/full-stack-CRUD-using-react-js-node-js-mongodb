import React from "react";
import { useLoaderData } from "react-router-dom";

const Update = () => {
  const loadedUser = useLoaderData();

  const handleUpdate = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    console.log(name, email);

    const updateUser = { name, email };

    fetch(`http://localhost:5000/users/${loadedUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUser),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          alert("User updated successfully.");
        } else {
          alert("No changes were made.");
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("There was an error updating the user. Please try again.");
      });
  };

  return (
    <div>
      <h2>Update data: {loadedUser.name}</h2>

      <form onSubmit={handleUpdate}>
        <input type="text" name="name" defaultValue={loadedUser?.name} />
        <br />
        <input type="email" name="email" defaultValue={loadedUser?.email} />
        <br />
        <input type="submit" value="Update" />
        <br />
      </form>
    </div>
  );
};

export default Update;
