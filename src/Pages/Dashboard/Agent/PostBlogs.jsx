// Full frontend React code with Edit + Delete for blogs

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useForm } from "react-hook-form";
import { HiPlus, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";

const PostBlogs = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axiosSecure.get("/blogs");
      setBlogs(res.data);
    };
    fetchBlogs();
  }, [axiosSecure]);

  const onSubmit = async (data) => {
    const blogData = {
      title: data.title,
      content: data.content,
      author: user?.displayName || "Unknown",
      authorEmail: user?.email,
      publishDate: new Date(),
    };

    try {
      const res = await axiosSecure.post("/blogs", blogData);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Blog published successfully!", "success");
        setBlogs((prev) => [...prev, { ...blogData, _id: res.data.insertedId }]);
        reset();
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error publishing blog:", err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/blogs/${id}`);
        if (res.data.deletedCount > 0) {
          setBlogs(blogs.filter((blog) => blog._id !== id));
          Swal.fire("Deleted!", "The blog has been deleted.", "success");
        }
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await axiosSecure.patch(`/blogs/${editBlog._id}`, {
        title: data.title,
        content: data.content,
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Blog updated successfully.", "success");
        setBlogs((prev) =>
          prev.map((b) => (b._id === editBlog._id ? { ...b, ...data } : b))
        );
        setEditBlog(null);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update blog", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">Manage Blogs</h2>
        <button onClick={() => setShowModal(true)} className="btn bg-[var(--color-primary)] text-white">
          <HiPlus className="text-xl" /> Add New Blog
        </button>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th>Title</th>
              <th>Author</th>
              <th>Content</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover">
                <td>{blog.title}</td>
                <td>{blog.author}</td>
               <td>{blog.content.length > 20 ? blog.content.slice(0, 20) + "..." : blog.content}</td>

                <td>{new Date(blog.publishDate).toLocaleDateString()}</td>
                <td className="text-right flex gap-2 justify-end">
                  <button
                    onClick={() => setEditBlog(blog)}
                    className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <HiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <Modal title="New Blog Post" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField label="Title" name="title" register={register} error={errors.title} required />
           <div>
  <label className="block text-sm font-medium mb-1">Author</label>
  <input
    type="text"
    value={user?.displayName || "Unknown"}
    readOnly
    className="input input-bordered w-full bg-gray-100"
  />
</div>
            <TextAreaField label="Content" name="content" register={register} error={errors.content} required />
            <div className="text-right">
              <button type="submit" className="btn bg-[var(--color-primary)] text-white">Publish</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editBlog && (
        <Modal title="Edit Blog" onClose={() => setEditBlog(null)}>
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <InputField
              label="Title"
              name="title"
              register={register}
              defaultValue={editBlog.title}
              required
            />
               <div>
  <label className="block text-sm font-medium mb-1">Author</label>
  <input
    type="text"
    value={user?.displayName || "Unknown"}
    readOnly
    className="input input-bordered w-full bg-gray-100"
  />
</div>
            <TextAreaField
              label="Content"
              name="content"
              register={register}
              defaultValue={editBlog.content}
              required
            />
            <div className="text-right">
              <button type="submit" className="btn bg-[var(--color-primary)] text-white">Update</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
      <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">{title}</h3>
      {children}
      <button onClick={onClose} className="absolute top-2 right-2 text-xl">✕</button>
    </div>
  </div>
);

const InputField = ({ label, name, register, error, defaultValue = "", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...register(name, required && { required: `${label} is required` })}
      defaultValue={defaultValue}
      className="input input-bordered w-full"
    />
    {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
  </div>
);

const TextAreaField = ({ label, name, register, error, defaultValue = "", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...register(name, required && { required: `${label} is required` })}
      defaultValue={defaultValue}
      rows={6}
      className="textarea textarea-bordered w-full"
    />
    {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
  </div>
);

export default PostBlogs;
