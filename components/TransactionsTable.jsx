import React from "react";

const TransactionsTable = () => {
  const transactions = [];

  return (
    <div className="p-6 bg-[#F3EAE7] rounded-lg shadow-md">
      <h2 className="text-lg mb-3">Recent Transactions</h2>
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-600">No recent transactions</p>
        ) : (
          <table className="min-w-full rounded-lg">
            <thead className="text-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">From Name & ID</th>
                <th className="py-2 px-4 text-left">To Name & ID</th>
                <th className="py-2 px-4 text-left">Transaction ID</th>
                <th className="py-2 px-4 text-left">Payment Mode</th>
                <th className="py-2 px-4 text-left">Date of Payment</th>
                <th className="py-2 px-4 text-left">Transaction Time</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td className="py-2 px-4">
                    {txn.fromName} - {txn.fromId}
                  </td>
                  <td className="py-2 px-4">
                    {txn.toName} - {txn.toId}
                  </td>
                  <td className="py-2 px-4">{txn.transactionId}</td>
                  <td className="py-2 px-4">{txn.paymentMode}</td>
                  <td className="py-2 px-4">{txn.paymentDate}</td>
                  <td className="py-2 px-4">{txn.transactionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
