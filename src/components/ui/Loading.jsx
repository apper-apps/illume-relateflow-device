import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
          <div className="h-10 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
        </div>
        
        {/* Metrics cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
                <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
              </div>
              <div className="h-10 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-2"></div>
              <div className="h-4 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="h-6 w-36 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-6"></div>
            <div className="h-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="h-6 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
                  <div className="h-4 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "contacts") {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
          <div className="flex gap-3">
            <div className="h-10 w-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
            <div className="h-10 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
            ))}
          </div>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100">
              {[...Array(5)].map((_, cellIndex) => (
                <div key={cellIndex} className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "deals") {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
          <div className="h-10 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
        </div>

        {/* Pipeline skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, stageIndex) => (
            <div key={stageIndex} className="bg-gray-50 rounded-xl p-4">
              <div className="h-6 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, cardIndex) => (
                  <div key={cardIndex} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="h-4 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-2"></div>
                    <div className="h-6 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-2"></div>
                    <div className="h-3 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default loading
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
              <div className="h-4 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
            </div>
            <div className="h-8 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
            <div className="h-4 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;