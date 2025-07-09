import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  HiOutlineUser,
  HiOutlineCurrencyBangladeshi,
  HiOutlineClock,
  HiOutlineUserCircle,
  HiOutlineFire,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

const QuotePage = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const age = parseInt(form.age.value);
    const gender = form.gender.value;
    const coverage = parseInt(form.coverage.value);
    const duration = parseInt(form.duration.value);
    const smoker = form.smoker.value === "yes";

    const baseRate = 0.05;
    let annual = (coverage * baseRate) / duration;

    if (age < 25) annual *= 0.9;
    else if (age >= 25 && age <= 35) annual *= 1;
    else if (age > 35 && age <= 50) annual *= 1.2;
    else annual *= 1.5;

    if (smoker) annual *= 1.3;

    const monthly = Math.round(annual / 12);
    annual = Math.round(annual);

    setQuote({ monthly, annual });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-10">
        📈 Get Your Insurance Quote
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[var(--color-primary)] p-6 rounded-xl shadow"
      >
        {/* Age */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <HiOutlineUser /> Age
          </label>
          <input
            type="number"
            name="age"
            required
            placeholder="Enter your age"
            className="input input-bordered w-full"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <HiOutlineUserCircle /> Gender
          </label>
          <select name="gender" required className="select select-bordered w-full">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Coverage */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <HiOutlineCurrencyBangladeshi /> Coverage Amount
          </label>
          <input
            type="number"
            name="coverage"
            required
            placeholder="e.g. 2000000"
            className="input input-bordered w-full"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <HiOutlineClock /> Duration (years)
          </label>
          <input
            type="number"
            name="duration"
            required
            placeholder="e.g. 20"
            className="input input-bordered w-full"
          />
        </div>

        {/* Smoker */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 flex items-center gap-2">
            <HiOutlineFire /> Smoker Status
          </label>
          <select name="smoker" required className="select select-bordered w-full">
            <option value="">Are you a smoker?</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-between items-center">
          <button
            type="submit"
            className="btn bg-[var(--color-primary)] text-white hover:bg-opacity-90"
          >
            <HiOutlineClipboardCheck className="text-lg" />
            Calculate Premium
          </button>

          {quote && (
            <button
              type="button"
              onClick={() => navigate("/apply")}
              className="btn btn-outline"
            >
              Apply for Policy
            </button>
          )}
        </div>
      </form>

      {/* Result */}
      {quote && (
        <div className="mt-8 bg-base-100 rounded-xl border border-[var(--color-primary)] p-6 text-center space-y-3 shadow">
          <h3 className="text-2xl font-semibold text-[var(--color-primary)]">
             Your Estimated Premium
          </h3>
          <p className="text-lg">
            <strong>Monthly:</strong> ৳{quote.monthly}
          </p>
          <p className="text-lg">
            <strong>Annual:</strong> ৳{quote.annual}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuotePage;
