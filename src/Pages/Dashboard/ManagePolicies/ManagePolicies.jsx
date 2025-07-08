import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchPolicies = async () => {
  const { data } = await axios.get("http://localhost:5000/policies");
  return data;
};

const ManagePolicies = () => {
  const queryClient = useQueryClient();
  const { data: policies = [], isLoading, isError } = useQuery(["policies"], fetchPolicies);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Add or update mutation
  const addPolicyMutation = useMutation(
    (newPolicy) => axios.post("http://localhost:5000/policies", newPolicy),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["policies"]);
        setModalOpen(false);
      },
    }
  );

  const updatePolicyMutation = useMutation(
    ({ id, updatedPolicy }) => axios.put(`http://localhost:5000/policies/${id}`, updatedPolicy),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["policies"]);
        setModalOpen(false);
      },
    }
  );

  // Delete mutation
  const deletePolicyMutation = useMutation(
    (id) => axios.delete(`http://localhost:5000/policies/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries(["policies"]),
    }
  );

  const openAddModal = () => {
    setEditingPolicy(null);
    reset();
    setModalOpen(true);
  };

  const openEditModal = (policy) => {
    setEditingPolicy(policy);
    reset(policy);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPolicy(null);
  };

  const onSubmit = (data) => {
    if (editingPolicy) {
      updatePolicyMutation.mutate({ id: editingPolicy.id, updatedPolicy: data });
    } else {
      addPolicyMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      deletePolicyMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading policies...</p>;
  if (isError) return <p>Error loading policies.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Insurance Policies</h1>
      <button
        onClick={openAddModal}
        className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
      >
        Add New Policy
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b border-gray-300">Image</th>
              <th className="p-3 border-b border-gray-300">Title</th>
              <th className="p-3 border-b border-gray-300">Category</th>
              <th className="p-3 border-b border-gray-300">Description</th>
              <th className="p-3 border-b border-gray-300">Age Range</th>
              <th className="p-3 border-b border-gray-300">Coverage Range</th>
              <th className="p-3 border-b border-gray-300">Duration Options</th>
              <th className="p-3 border-b border-gray-300">Base Premium</th>
              <th className="p-3 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No policies found.
                </td>
              </tr>
            )}
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50">
                <td className="p-2 border-b border-gray-300">
                  <img
                    src={policy.image}
                    alt={policy.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2 border-b border-gray-300">{policy.title}</td>
                <td className="p-2 border-b border-gray-300">{policy.category}</td>
                <td className="p-2 border-b border-gray-300">{policy.description}</td>
                <td className="p-2 border-b border-gray-300">
                  {policy.minAge} - {policy.maxAge}
                </td>
                <td className="p-2 border-b border-gray-300">{policy.coverageRange}</td>
                <td className="p-2 border-b border-gray-300">{policy.durationOptions}</td>
                <td className="p-2 border-b border-gray-300">{policy.basePremiumRate}</td>
                <td className="p-2 border-b border-gray-300 space-x-2">
                  <button
                    onClick={() => openEditModal(policy)}
                    className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
                    className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    disabled={deletePolicyMutation.isLoading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingPolicy ? "Edit Policy" : "Add New Policy"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Policy Title */}
              <div>
                <label className="block font-semibold mb-1">Policy Title</label>
                <input
                  {...register("title", { required: "Policy title is required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  <option value="Term Life">Term Life</option>
                  <option value="Senior">Senior</option>
                  <option value="Whole Life">Whole Life</option>
                  <option value="Universal Life">Universal Life</option>
                </select>
                {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">{errors.description.message}</p>
                )}
              </div>

              {/* Min Age & Max Age */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Minimum Age</label>
                  <input
                    type="number"
                    {...register("minAge", {
                      required: "Minimum age is required",
                      min: { value: 0, message: "Cannot be negative" },
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors.minAge && <p className="text-red-600 text-sm">{errors.minAge.message}</p>}
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Maximum Age</label>
                  <input
                    type="number"
                    {...register("maxAge", {
                      required: "Maximum age is required",
                      min: { value: 0, message: "Cannot be negative" },
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors.maxAge && <p className="text-red-600 text-sm">{errors.maxAge.message}</p>}
                </div>
              </div>

              {/* Coverage Range */}
              <div>
                <label className="block font-semibold mb-1">Coverage Range</label>
                <input
                  {...register("coverageRange", { required: "Coverage range is required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Example: $50,000 - $500,000"
                />
                {errors.coverageRange && (
                  <p className="text-red-600 text-sm">{errors.coverageRange.message}</p>
                )}
              </div>

              {/* Duration Options */}
              <div>
                <label className="block font-semibold mb-1">Duration Options</label>
                <input
                  {...register("durationOptions", { required: "Duration options are required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Example: 10, 20, 30 years"
                />
                {errors.durationOptions && (
                  <p className="text-red-600 text-sm">{errors.durationOptions.message}</p>
                )}
              </div>

              {/* Base Premium Rate */}
              <div>
                <label className="block font-semibold mb-1">Base Premium Rate</label>
                <input
                  {...register("basePremiumRate", { required: "Base premium rate is required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Example: $20/month"
                />
                {errors.basePremiumRate && (
                  <p className="text-red-600 text-sm">{errors.basePremiumRate.message}</p>
                )}
              </div>

              {/* Policy Image URL */}
              <div>
                <label className="block font-semibold mb-1">Policy Image URL</label>
                <input
                  {...register("image", { required: "Policy image URL is required" })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
                  disabled={addPolicyMutation.isLoading || updatePolicyMutation.isLoading}
                >
                  {editingPolicy ? "Update Policy" : "Add Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicies;
