import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaEye, FaClipboardCheck } from "react-icons/fa";

const ManageApplication = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch all applications
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications");
      return res.data;
    },
  });

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/applications/${id}/status`, { status }),
    onSuccess: (_data, variables) => {
      Swal.fire(
        "Success!",
        `Application ${variables.status.toLowerCase()} successfully.`,
        "success"
      );
      queryClient.invalidateQueries(["allApplications"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status.", "error");
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading applications...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load applications.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
    <h2 className="text-3xl font-semibold mb-6 text-[var(--color-primary)] flex items-center gap-2">
  <FaClipboardCheck className="text-4xl" />
  Manage Applications
</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Applicant</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Policy</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">No applications found.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{app.ApplicantName || "N/A"}</td>
                  <td className="px-4 py-3">{app.userEmail || "N/A"}</td>
                  <td className="px-4 py-3">{app.policyTitle || "N/A"}</td>
                  <td className="px-4 py-3">
                    {new Date(app.submittedAt || app.createdAt || "").toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <button
                      className="btn btn-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                      onClick={() => updateStatusMutation.mutate({ id: app._id, status: "Approved" })}
                      disabled={app.status === "Approved"}
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      className="btn btn-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      onClick={() => updateStatusMutation.mutate({ id: app._id, status: "Rejected" })}
                      disabled={app.status === "Rejected"}
                    >
                      <FaTimesCircle /> Reject
                    </button>
                    <button
                      className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                      onClick={() => {
                        setSelectedApplication(app);
                        document.getElementById("application_modal").showModal();
                      }}
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <dialog id="application_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl mb-4 flex text-[var(--color-primary)] items-center gap-2">
            <FaInfoCircle /> Application Details
          </h3>
          {selectedApplication && (
            <div className="space-y-2 text-sm">
              <p><strong>Applicant Name:</strong> {selectedApplication.ApplicantName}</p>
              <p><strong>Email:</strong> {selectedApplication.userEmail}</p>
              <p><strong>Policy Title:</strong> {selectedApplication.policyTitle}</p>
              <p><strong>Coverage:</strong> {selectedApplication.quoteInfo?.coverage}</p>
              <p><strong>Duration:</strong> {selectedApplication.quoteInfo?.duration} years</p>
              <p><strong>Annual Premium:</strong> ${selectedApplication.quoteInfo?.annual}</p>
              <p><strong>Status:</strong> {selectedApplication.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedApplication.submittedAt).toLocaleString()}</p>
            </div>
          )}
          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn btn-neutral">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageApplication;
