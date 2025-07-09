import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const ManagePolicies = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: policies = [], isLoading, isError } = useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/policies");
      return res.data;
    },
  });

  const addPolicyMutation = useMutation({
    mutationFn: async (newPolicy) => {
      const res = await axiosSecure.post("/policies", newPolicy);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]);
      reset();
      setModalOpen(false);
    },
  });

  const onSubmit = async (data) => {
    const imageFile = data.image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`,
        formData
      );
      const imageUrl = imgbbRes.data.data.url;

      const newPolicy = {
        title: data.title,
        category: data.category,
        description: data.description,
        minAge: Number(data.minAge),
        maxAge: Number(data.maxAge),
        coverageRange: data.coverageRange,
        durationOptions: data.durationOptions,
        basePremiumRate: Number(data.basePremiumRate),
        image: imageUrl,
      };

      addPolicyMutation.mutate(newPolicy);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Policies</h1>

      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Add New Policy
      </button>

      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {isError && <p className="text-center text-red-500">Failed to load policies.</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Age</th>
              <th className="p-3">Premium</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy._id} className="hover:bg-gray-50">
                <td className="p-2">{policy.title}</td>
                <td className="p-2">{policy.category}</td>
                <td className="p-2">{policy.minAge} - {policy.maxAge}</td>
                <td className="p-2">${policy.basePremiumRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Add New Policy</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register("title", { required: true })} placeholder="Policy Title" className="input input-bordered w-full" />
              <select {...register("category", { required: true })} className="select select-bordered w-full">
                <option value="">Select Category</option>
                <option value="Term Life">Term Life</option>
                <option value="Senior">Senior</option>
                <option value="Whole Life">Whole Life</option>
                <option value="Universal Life">Universal Life</option>
              </select>
              <textarea {...register("description", { required: true })} placeholder="Description" className="textarea textarea-bordered w-full" />
              <div className="flex gap-4">
                <input type="number" {...register("minAge", { required: true })} placeholder="Min Age" className="input input-bordered w-full" />
                <input type="number" {...register("maxAge", { required: true })} placeholder="Max Age" className="input input-bordered w-full" />
              </div>
              <input {...register("coverageRange", { required: true })} placeholder="Coverage Range" className="input input-bordered w-full" />
              <input {...register("durationOptions", { required: true })} placeholder="Duration Options" className="input input-bordered w-full" />
              <input type="number" {...register("basePremiumRate", { required: true })} placeholder="Base Premium Rate" className="input input-bordered w-full" />
              
              {/* ✅ Image File Input */}
              <input
                type="file"
                {...register("image", { required: true })}
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicies;
