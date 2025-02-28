import React from 'react';
import { Transaction } from '../services/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  totalCount,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="w-full overflow-x-auto mt-6">
        <table className="w-full border-collapse border-spacing-0 text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-4 text-left font-semibold border-b-2 border-gray-200">ID</th>
              <th className="p-4 text-left font-semibold border-b-2 border-gray-200">Client</th>
              <th className="p-4 text-left font-semibold border-b-2 border-gray-200">CPF/CNPJ</th>
              <th className="p-4 text-left font-semibold border-b-2 border-gray-200">Date</th>
              <th className="p-4 text-left font-semibold border-b-2 border-gray-200">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-12 text-gray-600">No transactions found</div>
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr 
                  key={transaction._id}
                  className="even:bg-gray-50 hover:bg-blue-50"
                >
                  <td className="p-4 border-b border-gray-200">{transaction.transactionId}</td>
                  <td className="p-4 border-b border-gray-200">{transaction.client.name}</td>
                  <td className="p-4 border-b border-gray-200">{transaction.client.document}</td>
                  <td className="p-4 border-b border-gray-200">{formatDate(transaction.date)}</td>
                  <td className="p-4 border-b border-gray-200">{formatAmount(transaction.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <div className="flex justify-between items-center mt-6 py-4">
          <div className="text-sm">
            Showing {transactions.length} of {totalCount} transactions
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              First
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              Previous
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 border rounded-md transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-blue-400 border-blue-400 text-white hover:bg-blue-400'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-md transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              Next
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-md transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTable;