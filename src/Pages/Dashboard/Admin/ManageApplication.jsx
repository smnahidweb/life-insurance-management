import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const ManageApplication = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Fetch all applications
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications");
      return res.data;
    },
  });

  // ✅ Mutation to update application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/applications/${id}/status`, { status });
    },
    onSuccess: (_data, variables) => {
      Swal.fire("Success!", `Application ${variables.status.toLowerCase()} successfully.`, "success");
      queryClient.invalidateQueries(["allApplications"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status.", "error");
    },
  });

  if (isLoading) return <div className="text-center p-6">Loading applications...</div>;
  if (error) return <div className="text-center p-6 text-red-600">Failed to load applications.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Applications</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Applicant Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Policy Name</th>
              <th className="px-4 py-2 border">Application Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">No applications found.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{app.ApplicantName || "N/A"}</td>
                  <td className="border px-4 py-2">{app.userEmail || "N/A"}</td>
                  <td className="border px-4 py-2">{app.policyTitle || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {new Date(app.submittedAt || app.createdAt || "").toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`badge ${
                        app.status === "Approved"
                          ? "badge-success"
                          : app.status === "Rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: app._id, status: "Approved" })
                      }
                      disabled={app.status === "Approved" || updateStatusMutation.isLoading}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: app._id, status: "Rejected" })
                      }
                      disabled={app.status === "Rejected" || updateStatusMutation.isLoading}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageApplication;
