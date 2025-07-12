import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Loading from "../../../Components/Loading";
import { FaCreditCard, FaDollarSign } from "react-icons/fa";

const ManageTransactions = () => {
  const axiosSecure = UseAxiosSecure();
  const [filters, setFilters] = useState({});

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await axiosSecure.get(`/payments?${params}`);
      return res.data;
    },
  });

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

  // 📊 Grouped by date for chart
  const chartData = payments.reduce((acc, payment) => {
    const date = format(new Date(payment.date), "MM/dd");
    const found = acc.find((d) => d.date === date);
    if (found) found.amount += payment.amount;
    else acc.push({ date, amount: payment.amount });
    return acc;
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header with title and total income */}
      <div className="flex justify-between items-center">
        <h2 className="flex items-center text-3xl font-bold text-[var(--color-primary)] space-x-2">
  <FaCreditCard className="text-[var(--color-primary)]" />
  <span>Manage Transactions</span>
</h2>

        {/* Total Income box with icon */}
        <div className="flex items-center bg-blue-500 text-white rounded-lg px-4 py-2 shadow-md select-none">
          <FaDollarSign className="mr-2 text-xl" />
          <div>
            <p className="text-sm font-semibold">Total Income</p>
            <p className="text-xl font-bold">${totalIncome.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <label className="label font-medium text-sm text-gray-600">
            Customer Email
          </label>
          <input
            type="text"
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="example@email.com"
            onChange={(e) =>
              setFilters({ ...filters, email: e.target.value.trim() })
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="label font-medium text-sm text-gray-600">
            Policy Name
          </label>
          <input
            type="text"
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="Policy title"
            onChange={(e) =>
              setFilters({ ...filters, policy: e.target.value.trim() })
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="label font-medium text-sm text-gray-600">From Date</label>
          <input
            type="date"
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="label font-medium text-sm text-gray-600">To Date</label>
          <input
            type="date"
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>
        <div className="flex items-end">
          <button
            className="btn btn-outline w-full"
            onClick={() => setFilters({})}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No transactions found.</p>
      ) : (
        <>
          {/* 📋 Transaction Table */}
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            <table className="table table-zebra w-full">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr>
                  <th>Transaction ID</th>
                  <th>Email</th>
                  <th>Policy</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.transactionId}>
                    <td className="text-sm">{p.transactionId}</td>
                    <td>{p.email}</td>
                    <td>{p?.policyTitle}</td>
                    <td>${p.amount}</td>
                    <td>{format(new Date(p.date), "PPP")}</td>
                    <td>
                      <span
                        className={`badge px-3 py-1 rounded-full ${
                          p.PaymentStatus === "paid"
                            ? "bg-green-400 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📊 Bar Chart */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h4 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
              Total Income: ${totalIncome.toFixed(2)}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${value}`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageTransactions;
