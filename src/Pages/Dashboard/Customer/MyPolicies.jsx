import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { AuthContext } from "../../../Context/AuthProvider";
import { FaClipboardList } from "react-icons/fa";

const MyPolicies = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useContext(AuthContext);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch applications for logged-in user
  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["myPolicies", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/application?email=${user.email}`);
      return res.data;
    },
  });

  const openReviewModal = (app) => {
    setSelectedApplication(app);
    document.getElementById("review_modal").showModal();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const review = {
      rating: parseInt(form.rating.value),
      comment: form.comment.value,
      userEmail: user.email,
      userName:user?.displayName,
      photo:user?.photoURL,
      policyId: selectedApplication.policyId,
      policyTitle: selectedApplication.policyTitle,
      submittedAt: new Date(),
    };

    try {
      // 1. Post the review
      const res = await axiosSecure.post("/reviews", review);
      if (res.data.insertedId) {
        // 2. Patch the application to mark reviewSubmitted: true
        await axiosSecure.patch(`/applications/${selectedApplication._id}`, {
          reviewSubmitted: true,
        });

        Swal.fire("Thank you!", "Review submitted successfully.", "success");

        form.reset();
        document.getElementById("review_modal").close();

        // 3. Refetch the applications list to update UI
        refetch();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        Swal.fire("Already Reviewed", "You have already reviewed this policy.", "info");
      } else {
        console.error("Review submission failed", error);
        Swal.fire("Oops!", "Failed to submit review.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
   <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] flex items-center gap-2">
  <FaClipboardList className="text-[var(--color-primary)]" />
  My Policies
</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Policy</th>
              <th>Status</th>
              <th>Coverage</th>
              <th>Duration</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.policyTitle}</td>
                <td>
                  <span
                    className={`badge ${
                      app.status === "Approved"
                        ? "badge-success"
                        : app.status === "Rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td>{app.quoteInfo.coverage}</td>
                <td>{app.quoteInfo.duration} yrs</td>
                <td>${app.quoteInfo.monthly}</td>
                <td>
                  {app.reviewSubmitted ? (
                    <button className="btn btn-sm btn-success cursor-default" disabled>
                      Reviewed
                    </button>
                  ) : (
                    <button
                      onClick={() => openReviewModal(app)}
                      className="btn btn-sm btn-primary"
                    >
                      Give Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Submit a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <label className="block mb-1 text-sm">Rating (1-5)</label>
            <select
              name="rating"
              className="select select-bordered w-full mb-3"
              required
            >
              <option value="">Choose rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>

            <label className="block mb-1 text-sm">Your Feedback</label>
            <textarea
              name="comment"
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Write your experience..."
              required
            ></textarea>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("review_modal").close()}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default MyPolicies;
