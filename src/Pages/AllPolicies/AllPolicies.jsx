import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // fixed import
import UseAxios from "../../Hooks/UseAxios";
import { useQuery } from "@tanstack/react-query";
import { FaTags } from "react-icons/fa"; // Single icon for all categories

const AllPolicies = () => {
  const axiosPublic = UseAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const policiesPerPage = 9;

  // Fetch available categories from backend
  useEffect(() => {
    axiosPublic.get("/policy-categories").then((res) => {
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      }
    });
  }, [axiosPublic]);

 
  const { data: policyData = {}, isLoading } = useQuery({
    queryKey: ["policies", currentPage, category],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/policies?page=${currentPage}&limit=${policiesPerPage}&category=${category}`
      );
      return res.data;
    },
  });

  const totalPages = Math.ceil((policyData.total || 0) / policiesPerPage);

  const handleFilterChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // reset to first page when filter changes
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">
        All Insurance Policies
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-6 text-center">
        <select
          value={category}
          onChange={handleFilterChange}
          className="select select-bordered"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Policy Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading policies...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policyData.policies?.map((policy) => (
            <div
              key={policy._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all flex flex-col"
            >
              <img
                src={policy.image}
                alt={policy.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                    {policy.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 italic mb-1">
                    <FaTags className="text-[var(--color-primary)]" />
                    <span className="ml-2">{policy.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {(policy.description || "No details available").slice(0, 90)}...
                  </p>
                  <p className="text-sm text-gray-700 font-semibold">
                    Base Premium: ${policy.basePremiumRate}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/policies/${policy._id}`}
                    className="btn btn-sm btn-primary w-full"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            className={`btn btn-sm ${
              currentPage === num + 1
                ? "bg-[var(--color-primary)] text-white"
                : "btn-outline"
            }`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllPolicies;
