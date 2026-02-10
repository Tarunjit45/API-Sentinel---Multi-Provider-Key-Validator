
import React from 'react';
import { ValidationStatus } from '../types';

interface StatusBadgeProps {
  status: ValidationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case ValidationStatus.VALID:
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
          VALID
        </span>
      );
    case ValidationStatus.INVALID:
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
          INVALID
        </span>
      );
    case ValidationStatus.PENDING:
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
          TESTING...
        </span>
      );
    case ValidationStatus.ERROR:
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          CORS/NETWORK
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
          IDLE
        </span>
      );
  }
};
