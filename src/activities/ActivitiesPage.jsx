import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation"; 
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";


export default function ActivitiesPage() {
  const { data, loading, error } = useQuery("/activities", "activities");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const {mutate,loading: mutationLoading,error: mutationError,} = useMutation("POST", "/activities", ["activities"]);
  const {mutate: deleteActivity,error: deleteError,loading: deleteLoading,} = useMutation("DELETE", "/activities", ["activities"]);
  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await mutate({ name, description }); 
      setName(""); 
      setDescription("");
    } catch (err) {
      console.error("Failed to create activity", err);
    }
  }

  async function handleDelete(activityId) {
    try {
      await deleteActivity({}, `/activities/${activityId}`);
    } catch (err) {
      console.error("Failed to delete activity:", err.message);
    }
  }

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error loading activities: {error}</p>;

  return (
    <div>
      <h1>Activities</h1>
      {data && data.length > 0 ? (
        <ul>
          {data.map((activity) => (
            <li key={activity.id}>
              <strong>{activity.name}</strong>
              {token && (<button onClick={()=> handleDelete(activity.id)}>Delete</button>)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities available.</p>
      )}

      {deleteError && (
        <p style={{ color: "red" }}> {String(deleteError).includes("not authorized") ? "You are not authorized to delete this activity." : deleteError} </p>
)}


      {/* ======= New Activity Form ======= */}
      <form onSubmit = {handleSubmit}>
        <h2> create new activity </h2>
        <label> Name:<input type = "text" value={name} onChange={(e)=>setName(e.target.value)} required/> </label>
        <br/>
        <label> Description:<input type = "text" value={description} onChange={(e)=>setDescription(e.target.value)} required/> </label>
        <br/>
        <button type="submit" disabled={mutationLoading}>{mutationLoading ? "Adding..." : "Add Activity"}</button>


      </form>
    </div>
  );
}
