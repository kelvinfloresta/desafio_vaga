'use client';

import FileUpload from '@/components/FileUpload';
import TransactionFilter from '@/components/FilterForm';
import TransactionTable from '@/components/TransactionTable';
import { Transaction, transactionService } from '@/services/transaction';
import React, { useEffect, useState } from 'react';
import './globals.css';

interface FilterValues {
 readonly name: string;
 readonly startDate: string;
 readonly endDate: string;
}

const INITIAL_FORM: FilterValues = {
  name: '',
  startDate: '',
  endDate: '',
};

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FORM);

  const fetchTransactions = async (page: number, filters: FilterValues) => {
    try {
      setIsLoading(true);
      const response = await transactionService.get({
        limit: 10,
        page,
        ...filters,
      });

      setTransactions(response.data.transactions);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, filters);
  }, [currentPage, filters]);

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Transaction Dashboard</h1>
        <p className="text-base text-gray-600">Upload and manage transaction data</p>
      </header>

      <FileUpload onSuccess={() => fetchTransactions(currentPage, filters)} />

      <TransactionFilter onFilter={handleFilter} />

      <TransactionTable
        transactions={transactions}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;