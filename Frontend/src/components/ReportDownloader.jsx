import React from 'react';
import api from '../utils/api';

function ReportDownloader() {
  const downloadReport = async (reportType) => {
    try {
      const response = await api.get(`/admin/reports/${reportType}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(`Error downloading ${reportType} report:`, err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Download Reports</h2>
      <div className="flex space-x-2">
        <button onClick={() => downloadReport('lab-usage')} className="bg-blue-500 text-white px-4 py-2 rounded">
          Lab Usage
        </button>
        <button onClick={() => downloadReport('student-list')} className="bg-green-500 text-white px-4 py-2 rounded">
          Student List
        </button>
        <button onClick={() => downloadReport('evaluator-list')} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Evaluator List
        </button>
        <button onClick={() => downloadReport('progress')} className="bg-purple-500 text-white px-4 py-2 rounded">
          Progress Report
        </button>
        <button onClick={() => downloadReport('log')} className="bg-red-500 text-white px-4 py-2 rounded">
          Log Report
        </button>
      </div>
    </div>
  );
}

export default ReportDownloader;
