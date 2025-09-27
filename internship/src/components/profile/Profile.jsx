import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
  3
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/profile");
        const data = res.data;
        setUser(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          location: data.location || "",
          skills: data.skills?.join(", ") || "",
          profilePic: null,
          resume: null,
          linkedin: data.social?.linkedin || "",
          github: data.social?.github || "",
          twitter: data.social?.twitter || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Basic validation example
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("phone", form.phone);
      data.append("location", form.location);
      data.append("skills", form.skills);

      if (form.profilePic) data.append("profilePic", form.profilePic);
      if (form.resume) data.append("resume", form.resume);

      data.append("linkedin", form.linkedin);
      data.append("github", form.github);
      data.append("twitter", form.twitter);

      const res = await axios.put("http://localhost:5000/api/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err.response || err);
      alert(err.response?.data?.msg || "Failed to update profile!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        skills: user.skills?.join(", ") || "",
        profilePic: null,
        resume: null,
        linkedin: user.social?.linkedin || "",
        github: user.social?.github || "",
        twitter: user.social?.twitter || "",
      });
    }
    setEditMode(false);
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10">Failed to load profile.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-4">
        <img
          src={
            user.profilePic
              ? `http://localhost:5000${user.profilePic}`
              : "https://via.placeholder.com/100"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
      </div>

      {!editMode ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          <p><strong>Location:</strong> {user.location || "N/A"}</p>
          <p><strong>Skills:</strong> {user.skills?.join(", ") || "N/A"}</p>
          <p><strong>LinkedIn:</strong> {user.social?.linkedin || "N/A"}</p>
          <p><strong>GitHub:</strong> {user.social?.github || "N/A"}</p>
          <p><strong>Twitter:</strong> {user.social?.twitter || "N/A"}</p>
          <p>
            <strong>Resume:</strong>{" "}
            {user.resume ? (
              <a
                href={`http://localhost:5000${user.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            ) : (
              "Not uploaded"
            )}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-3">
          <label className="block">
            <span className="font-medium">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="Full Name"
              required
            />
          </label>

          <label className="block">
            <span className="font-medium">Phone</span>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="Phone"
            />
          </label>

          <label className="block">
            <span className="font-medium">Location</span>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="Location"
            />
          </label>

          <label className="block">
            <span className="font-medium">Skills (comma separated)</span>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="e.g. JavaScript, React, Node"
            />
          </label>

          <label className="block">
            <span className="font-medium">LinkedIn URL</span>
            <input
              type="text"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </label>

          <label className="block">
            <span className="font-medium">GitHub URL</span>
            <input
              type="text"
              name="github"
              value={form.github}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="https://github.com/yourusername"
            />
          </label>

          <label className="block">
            <span className="font-medium">Twitter URL</span>
            <input
              type="text"
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
              placeholder="https://twitter.com/yourhandle"
            />
          </label>

          <label className="block mt-2">
            <span className="font-medium">Profile Picture</span>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              className="w-full border p-2 mt-1"
              onChange={handleChange}
            />
          </label>

          <label className="block mt-2">
            <span className="font-medium">Resume (PDF)</span>
            <input
              type="file"
              name="resume"
              accept=".pdf"
              className="w-full border p-2 mt-1"
              onChange={handleChange}
            />
          </label>

          <div className="flex space-x-3 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-2 rounded text-white ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
