import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; 
import UseAxios from "../../../Hooks/UseAxios";
import {
  FiShield,
  FiClock,
  FiStar,
  FiEye,
} from "react-icons/fi";

const PopularPolicies = () => {
  const axiosPublic = UseAxios();

  const { data: popularPolicies = [], isLoading, isError } = useQuery({
    queryKey: ["popularPolicies"],
    queryFn: async () => {
      const res = await axiosPublic.get("/top-policies");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Loading popular policies...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-600 text-lg">
        Failed to load popular policies.
      </div>
    );

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">
           Popular Insurance Policies
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {popularPolicies.map((policy) => (
            <div
              key={policy._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
            >
              {/* ✅ Image */}
              <img
                src={policy.image}
                alt={policy.title}
                className="h-48 w-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Image")
                }
              />

              {/* ✅ Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                  <FiShield /> {policy.title}
                </h3>

                <div className="text-gray-700 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <FiClock className="text-primary" />
                    <span className="font-medium">Duration:</span>{" "}
                    {policy.durationOptions}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiShield className="text-green-600" />
                    <span className="font-medium">Coverage:</span>{" "}
                    {policy.coverageRange}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    <span className="font-medium">Popularity:</span>{" "}
                    {policy.purchaseCount} Purchases
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/policies/${policy._id}`}
                    className="flex items-center justify-center gap-2 w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
                  >
                    <FiEye />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPolicies;
